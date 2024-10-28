const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;

const FolderConfig = struct {
    path: []const u8,
    retention: u32
};

const Config = struct {
    tempFolders: []FolderConfig
};

const CustomRetentions = std.json.ArrayHashMap(
    std.json.ArrayHashMap(u32)
);

// Function to read the config file.
// It returns a Config struct of the config.json file.
fn readConfig(allocator: Allocator, path: []const u8) !std.json.Parsed(Config) {
    // 512 is the maximum size to read, if your config is larger you should make this bigger.
    const data = std.fs.cwd().readFileAlloc(allocator, path, 512) catch |err| {
        if (err == error.FileNotFound) {
            std.debug.print("Config file not found :(... Exiting", .{});
            std.process.exit(1);
        }
        return err;
    };
    defer allocator.free(data);

    return std.json.parseFromSlice(Config, allocator, data, .{ .allocate = .alloc_always });
}

test "readConfig memory leaks" {
    const allocator = std.testing.allocator;
    const config = try readConfig(allocator, "config.json");
    defer config.deinit();
}

// Read customized configuration from a gziped json file.
fn readCustomRetentions(allocator: Allocator, path: []const u8) !?std.json.Parsed(CustomRetentions) {
    const file = std.fs.cwd().openFile(path, .{}) catch |err| {
        if (err == error.FileNotFound) {
            std.debug.print("Custom retentions file not found\n", .{});
            return null;
        }
        return err;
    };
    defer file.close();

    var output = std.ArrayList(u8).init(allocator);
    defer output.deinit();

    try std.compress.gzip.decompress(file.reader(), output.writer());

    return std.json.parseFromSlice(CustomRetentions, allocator, output.items, .{ .allocate = .alloc_always }) catch |err| {
        if (err == error.SyntaxError) {
            std.debug.print("CustomRetentions not properly formatted", .{});
            std.process.exit(1);
        }
        return err;
    };
}

test "readCustomRetentions memory leaks" {
    const allocator = std.testing.allocator;
    const custom_retentions = try readCustomRetentions(allocator, "customRetentions.bin");
    defer custom_retentions.?.deinit();
}

// Function to create a "temp" folder in a specific path: for the moment, the path is the current working directory.
// It creates also a file called "HowToUse.md" in the temp folder to init the using of the temp folder.
// The function ignores the error if the folder already exists and continue the execution, because we don't suppress the temp folder if it already exists.
fn tempFolderInit(tempFolderPath: []const u8) !void {
    // Error handling for the creation of the temp folder.
    errdefer {
        std.debug.print("Failed to create temp folder.\n", .{});
        std.process.exit(1);
    }

    // Try to make the temp folder...
    std.fs.makeDirAbsolute(tempFolderPath) catch |e|
        switch (e) {
        error.PathAlreadyExists => {
            // Path already exists, we ignore the error and continue the execution.
            return;
        },
        else => return e,
    };
    // "temp" folder was created!
}

// Function to convert nanoseconds to seconds.
// It return an u64 to be optimized unlike the std.time.nsToSec function which return an i128.
fn nsToSeconds(ns: i128) u32 {
    return @as(u32, @intCast(@divTrunc(ns, 1000000000)));
}

// Fonction wich crawl the temp folder and check the date of the files.
// If the date of the last access of a file is greater than the number of days chosen by the user, the file is deleted.
fn checkFilesDate(tempFolderPath: []const u8, retentionPeriod: u32, custom_retentions: ?std.json.ArrayHashMap(u32)) !u32 {
    std.debug.print("{s}\n", .{tempFolderPath});
    var iter_dir = try std.fs.openDirAbsolute(tempFolderPath, .{ .iterate = true });
    defer iter_dir.close();

    var iterator = iter_dir.iterate();
    var min_time_left = retentionPeriod;

    while (try iterator.next()) |entry| {
        switch (entry.kind) {
            std.fs.File.Kind.file, std.fs.File.Kind.directory => {
                std.debug.print("File: {s}\n", .{entry.name});

                var buffer: [std.fs.max_path_bytes]u8 = undefined;

                const path = try std.fmt.bufPrint(&buffer, "{s}{c}{s}", .{ tempFolderPath, std.fs.path.sep, entry.name });
                std.debug.print("{s}\n", .{path});

                // Get the latest access of the file.
                const stat = if (entry.kind == std.fs.File.Kind.file) try std.fs.cwd().statFile(path) else try (try std.fs.openDirAbsolute(path, .{ .access_sub_paths = false })).stat();

                // Convert with the function nsToSeconds the latest access of the file and the current time to seconds.
                const lastAccess = nsToSeconds(@max(stat.atime, @max(stat.ctime, stat.mtime)));
                const currentTime = nsToSeconds(std.time.nanoTimestamp());
                // Calculate the difference between the latest access of the file and the current time.
                const timeDifference = currentTime - lastAccess;
                std.debug.print("Time difference: {d}\n", .{timeDifference});

                var timeLeft: i33 = undefined;

                if (custom_retentions != null)
                    timeLeft = @as(i33, timeDifference ) - @as(i33, (custom_retentions.?.map.get(entry.name) orelse retentionPeriod))
                else
                    timeLeft = @as(i33, timeDifference ) - @as(i33, retentionPeriod);

                // If the difference is greater than the number of seconds chosen by the user, delete the file.
                if (timeLeft >= 0) {
                    if (entry.kind == std.fs.File.Kind.file) try std.fs.cwd().deleteFile(path) else try std.fs.cwd().deleteTree(path);
                } else {
                    min_time_left = @min(min_time_left, @as(u32, @intCast(-timeLeft)));
                }
            },
            else => {
                std.debug.print("Unsupported file type: {any} (on file: {s}), currentrly supported types are file and directory\n", .{ entry.kind, entry.name });
            },
        }
    }
    return min_time_left;
}

// Main function.
pub fn main() !noreturn {
    // Init the variables.
    var gpa = std.heap.GeneralPurposeAllocator(.{
        .enable_memory_limit = true
    }){};
    const allocator = gpa.allocator();

    var self_path_buffer: [std.fs.MAX_PATH_BYTES]u8 = undefined;
    const self_path = std.fs.selfExeDirPath(&self_path_buffer) catch |err| {
        std.debug.print("Unable to get executable path: {}", .{err});
        std.process.exit(1);
    };

    std.debug.print("Exe path: {s}\n", .{self_path});

    const parsed = try readConfig(allocator, "config.json");
    defer parsed.deinit();
    const config = parsed.value;

    for (config.tempFolders) |tempFolder| {
        if (tempFolder.retention == 0) {
            std.debug.print("The retention period can't be 0.\n", .{});
            std.process.exit(1);
        }

        // Call the function tempFolderInit to create/initialize the temp folder.
        try tempFolderInit(tempFolder.path);
    }


    const custom_retentions_parsed = try readCustomRetentions(allocator, "customRetentions.bin");
    defer {
        if (custom_retentions_parsed != null)
            custom_retentions_parsed.?.deinit();
    }

    const custom_retentions = custom_retentions_parsed.?.value.map;

    while(true) {
        // Call the function checkFilesDate to check the date of the files in the temp folder and delete them if they are too old.
        var timeLeft: u32 = std.math.maxInt(u32);

        for (config.tempFolders) |tempFolder| {
            timeLeft = @min(
                timeLeft, 
                try checkFilesDate(tempFolder.path, tempFolder.retention, custom_retentions.get(tempFolder.path))
            );
        }

        std.debug.print("Sleeping for: {d}s\n", .{timeLeft});
        std.time.sleep(@as(u64, timeLeft) * std.time.ns_per_s);
        std.debug.print("Refreshing...\n", .{});
    }

    std.debug.print("Goodbye, World!\n", .{});
}
