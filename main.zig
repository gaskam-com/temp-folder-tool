const std = @import("std");
const fs = std.fs;

// Function to create a "temp" folder in a specific path: for the moment, the path is the current working directory.
// It creates also a file called "HowToUse.md" in the temp folder to init the using of the temp folder.
// The function ignores the error if the folder already exists and continue the execution, because we don't suppress the temp folder if it already exists.
fn tempFolderInit(tempFolderPath: []const u8) !void {
    // Error handling for the creation of the temp folder.
    errdefer {
        std.debug.print("Failed to create temp folder.\n", .{});
        std.os.exit(1);
    }

    // Try to make the temp folder...
    std.fs.cwd().makeDir(tempFolderPath) catch |e|
        switch (e) {
        error.PathAlreadyExists => {
            // Path already exists, we ignore the error and continue the execution.
            return;
        },
        else => return e,
    };
    // "temp" folder was created!

    // Try to create the file "HowToUse.md" in the temp folder.
    const file = try std.fs.cwd().createFile(
        "temp/HowToUse.md",
        .{ .read = true },
    );
    defer file.close();

    // Write the content of the file "HowToUse.md".
    const bytes_written = try file.writeAll("# Temp Folder Tool \n### How to use this temp folder ? \n\n1. Execute the program 'TempFolderTool' pined on your desktop. \n2. Choose your settings, like the time you want to keep every file in the temp folder after their latest access. \n3. You can configure a personilized time for each file in the temp folder. \n4. And I invite you to explore the other options. \n5. Enjoy !");
    _ = bytes_written;
}

// // Function to ask the user how many days he wants to keep his files in the temp folder after their latest access.
// fn askUser(retentionPeriod: *[5]u8) !void { // TODO undeprecate readUntilDelimiter
//     const stdin = std.io.getStdIn().reader();
//     const stdout = std.io.getStdOut().writer();

//     try stdout.print("How many days do you want to keep your files after they have been opened?\n", .{});
//     // _ = try stdin.readUntilDelimiter(retentionPeriod, '\n'); // deprecated: change to streamUntilDelimiter and obtain an int

//     std.io.Writer(comptime Context: type, comptime WriteError: type, comptime writeFn: fn(context:Context, bytes:[]const u8)WriteError!usize)
//     _ = try stdin.streamUntilDelimiter(&retentionPeriod.*, '\n', 4); // deprecated: change to streamUntilDelimiter and obtain an int
// }

// Function to convert nanoseconds to seconds.
// It return an u64 to be optimized unlike the std.time.nsToSec function which return an i128.
fn nsToSeconds(ns: i128) u64 {
    return @as(u64, @intCast(@divTrunc(ns, 1000000000)));
}

// Fonction wich crawl the temp folder and check the date of the files.
// If the date of the last access of a file is greater than the number of days chosen by the user, the file is deleted.
fn checkFilesDate(tempFolderPath: []const u8, retentionPeriod: *[5]u8) !void {
    _ = tempFolderPath;
    // We need to convert the retentionPeriod from a string to an int.
    std.debug.print("{}\n", .{@TypeOf(retentionPeriod)});
    var number: u64 = try std.fmt.parseInt(u64, retentionPeriod.*, 10); // ! doesn't work because it's a string and not an int
    std.debug.print("{}\n", .{number});

    // Get the latest access of the file.
    var stat = try fs.cwd().statFile("temp/HowToUse.md");

    // Convert with the function nsToSeconds the latest access of the file and the current time to seconds.
    var lastAccess = nsToSeconds(stat.atime);
    var currentTime = nsToSeconds(std.time.nanoTimestamp());
    // Calculate the difference between the latest access of the file and the current time.
    var timeDifference = currentTime - lastAccess;

    // If the difference is greater than the number of seconds chosen by the user, delete the file.
    if (timeDifference > retentionPeriod) {
        try std.fs.cwd().deleteFile("temp/HowToUse.md");
    }
}

// Main function.
pub fn main() !void {
    // Init the variables.
    var retentionPeriod: [5]u8 = undefined;
    const tempFolderPath: []const u8 = "temp";
    std.debug.print("Hello, World!\n", .{});

    // Call the function tempFolderInit to create/initialize the temp folder.
    try tempFolderInit(tempFolderPath);

    // Call the function askUser to ask the user how many days he wants to keep his files in the temp folder after their latest access.
    // It will be remove when the GUI will be implemented.
    // try askUser(&retentionPeriod);
    // while (retentionPeriod[0] == '0') {
    //     std.debug.print("You can't keep your files for 0 days, please choose a number of days greater than 0.\n", .{});
    //     try askUser(&retentionPeriod);
    // }
    // std.debug.print("Files will be removed after {s} days of inactivity.\n", .{retentionPeriod});

    // Call the function checkFilesDate to check the date of the files in the temp folder and delete them if they are too old.
    try checkFilesDate(tempFolderPath, &retentionPeriod);

    std.debug.print("Goodbye, World!\n", .{});
}
