const std = @import("std");
const Allocator = std.mem.Allocator;
const fs = std.fs;
const os = std.os;
const json = std.json;
const debug = std.debug;
const fileKind = fs.File.Kind;
const bufPrint = std.fmt.bufPrint;

const Config = struct { tempFolderPath: []const u8, retentionPeriod: u32 };

// Function to read the config file.
// It returns a Config struct of the config.json file.
fn readConfig(allocator: Allocator, path: []const u8) !json.Parsed(Config) {
    // 512 is the maximum size to read, if your config is larger you should make this bigger.
    const data = try fs.cwd().readFileAlloc(allocator, path, 512);
    defer allocator.free(data);
    return json.parseFromSlice(Config, allocator, data, .{ .allocate = .alloc_always });
}

// Function to create a "temp" folder in a specific path: for the moment, the path is the current working directory.
// It creates also a file called "HowToUse.md" in the temp folder to init the using of the temp folder.
// The function ignores the error if the folder already exists and continue the execution, because we don't suppress the temp folder if it already exists.
fn tempFolderInit(tempFolderPath: []const u8) !void {
    // Error handling for the creation of the temp folder.
    errdefer {
        debug.print("Failed to create temp folder.\n", .{});
        os.exit(1);
    }

    // Try to make the temp folder...
    fs.cwd().makeDir(tempFolderPath) catch |e|
        switch (e) {
        error.PathAlreadyExists => {
            // Path already exists, we ignore the error and continue the execution.
            return;
        },
        else => return e,
    };
    // "temp" folder was created!

    // TODO try to create the file "HowToUse.md" in the temp folder anywhere in the system.
    // Try to create the file "HowToUse.md" in the temp folder.
    const file = try fs.cwd().createFile(
        "../temp/HowToUse.md",
        .{ .read = true },
    );
    defer file.close();

    // Write the content of the file "HowToUse.md".
    const bytes_written = try file.writeAll("# Temp Folder Tool \n### How to use this temp folder ? \n\n1. Execute the program 'TempFolderTool' pined on your desktop. \n2. Choose your settings, like the time you want to keep every file in the temp folder after their latest access. \n3. You can configure a personilized time for each file in the temp folder. \n4. And I invite you to explore the other options. \n5. Enjoy !");
    _ = bytes_written;
}

// Function to convert nanoseconds to seconds.
// It return an u64 to be optimized unlike the std.time.nsToSec function which return an i128.
fn nsToSeconds(ns: i128) u64 {
    return @as(u64, @intCast(@divTrunc(ns, 1000000000)));
}

// Fonction wich crawl the temp folder and check the date of the files.
// If the date of the last access of a file is greater than the number of days chosen by the user, the file is deleted.
fn checkFilesDate(tempFolderPath: []const u8, retentionPeriod: u32) !void {
    debug.print("{s}\n", .{tempFolderPath});
    var iter_dir = try fs.openDirAbsolute(tempFolderPath, .{ .iterate = true });
    defer iter_dir.close();

    var iterator = iter_dir.iterate();
    while (try iterator.next()) |entry| {
        switch (entry.kind) {
            fileKind.file, fileKind.directory => {
                debug.print("File: {s}\n", .{entry.name});

                var buffer: [255]u8 = undefined;

                const path = try bufPrint(&buffer, "{s}/{s}", .{ tempFolderPath, entry.name });
                debug.print("{s}\n", .{path});

                // Get the latest access of the file.
                const stat = if (entry.kind == fileKind.file) try fs.cwd().statFile(path) else try (try fs.openDirAbsolute(path, .{ .access_sub_paths = false })).stat();

                // Convert with the function nsToSeconds the latest access of the file and the current time to seconds.
                const lastAccess = nsToSeconds(stat.atime);
                const currentTime = nsToSeconds(std.time.nanoTimestamp());
                // Calculate the difference between the latest access of the file and the current time.
                const timeDifference = currentTime - lastAccess;

                // If the difference is greater than the number of seconds chosen by the user, delete the file.
                if (timeDifference > retentionPeriod) {
                    try fs.cwd().deleteFile(path);
                }
            },
            else => {
                debug.print("Unsupported file type: {any} (on file: {s}), currentrly supported types are file and directory\n", .{ entry.kind, entry.name });
            },
        }
    }
}

// Main function.
pub fn main() !void {
    // Init the variables.
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const parsed = try readConfig(allocator, "config.json");
    defer parsed.deinit();
    const config = parsed.value;

    const retentionPeriod: u32 = config.retentionPeriod;
    if (retentionPeriod == 0) {
        debug.print("The retention period can't be 0.\n", .{});
        os.exit(1);
    }
    const tempFolderPath: []const u8 = config.tempFolderPath;

    // debug.print("Hello, World!\n", .{});

    // Call the function tempFolderInit to create/initialize the temp folder.
    try tempFolderInit(tempFolderPath);

    // Call the function checkFilesDate to check the date of the files in the temp folder and delete them if they are too old.
    try checkFilesDate(tempFolderPath, retentionPeriod);

    // debug.print("Goodbye, World!\n", .{});
}
