const std = @import("std");
const io = @import("std").io;
const fs = std.fs;

fn tempFolderInit(path: []const u8) !void { // It's OK ! But we can add a better error handling with a try catch - I think we can edit to "anyerror!void"
    errdefer {
        std.debug.print("Failed to create temp folder.\n", .{});
        std.os.exit(1);
    }

    std.fs.cwd().makeDir(path) catch |e|
        switch (e) {
        error.PathAlreadyExists => {
            std.debug.print("'temp' path already exists\n", .{});
            return;
        },
        else => return e,
    };
    std.debug.print("'temp' path was created\n", .{});

    const file = try std.fs.cwd().createFile(
        "temp/HowToUse.md",
        .{ .read = true },
    );
    defer file.close();

    const bytes_written = try file.writeAll("# Temp Folder Tool \n### How to use this temp folder ? \n\n1. Execute the program 'TempFolderTool' pined on your desktop. \n2. Choose your settings, like the time you want to keep every file in the temp folder after their lastest access. \n3. You can configure a personilized time for each file in the temp folder. \n4. And I invite you to explore the other options. \n5. Enjoy !");
    _ = bytes_written;
}

fn askUser(numberOfDays: *[]const u8) !void { // Delete this comment when the function is OK
    const stdin = std.io.getStdIn().reader();
    const stdout = std.io.getStdOut().writer();

    try stdout.print("How many days do you want to keep your files after they have been opened?\n", .{});

    _ = try stdin.readUntilDelimiter(numberOfDays, '\n'); // deprecated: change to streamUntilDelimiter and obtain an int
}

fn nsToSeconds(ns: i128) u64 { // It's OK ! The conversion is done
    return @as(u64, @intCast(@divTrunc(ns, 1000000000)));
}

fn checkFilesDate(path: []const u8, numberOfDays: *[5]u8) !void {
    _ = path;
    var number: u64 = try std.fmt.parseInt(u64, numberOfDays, 10); // doesn't work because it's a string and not an int
    std.debug.print("{}\n", .{number});

    var numberOfSeconds = number * 86400;
    std.debug.print("{}\n", .{numberOfSeconds});

    var stat = try fs.cwd().statFile("temp/HowToUse.md");

    var lastAccess = nsToSeconds(stat.atime);
    var currentTime = nsToSeconds(std.time.nanoTimestamp());
    var timeDifference = currentTime - lastAccess;

    if (timeDifference > 5) {
        try std.fs.cwd().deleteFile("temp/HowToUse.md");
    }
}

pub fn main() !void {
    var numberOfDays: []const u8 = undefined;
    var pathTemp: []const u8 = "temp";
    std.debug.print("Hello, World!\n", .{});

    try tempFolderInit(pathTemp);

    try askUser(&numberOfDays);
    while (numberOfDays[0] == '0') {
        std.debug.print("You can't keep your files for 0 days, please choose a number of days greater than 0.\n", .{});
        try askUser(&numberOfDays);
    }
    std.debug.print("Files will be removed after {s} days of inactivity.\n", .{numberOfDays});

    try checkFilesDate(pathTemp, &numberOfDays);

    std.debug.print("Goodbye, World!\n", .{});
}
