const webui = @import("webui");
const std = @import("std");

fn close(_: *webui.Event) void {
    std.debug.print("Exit.\n", .{});

    // Close all opened windows
    webui.exit();
}

pub fn main() !void {
    var win = webui.newWindow();

    // const allocator = std.heap.page_allocator;
    var buffer: [std.fs.MAX_PATH_BYTES]u8 = undefined;

    const length = (try std.fs.realpath("./src/ui", &buffer)).len;
    buffer[length] = 0;
    const path = buffer[0..length:0];

    _ = win.setMinimumSize(800, 600);
    _ = win.setRootFolder(path);
    _ = win.bind("close_app", close);
    _ = win.show("index.html");
    const jsCommand = try std.fmt.allocPrint(allocator, "displayFolders({s});\x00", .{ try getConfig(allocator, "../APP/config.json") });
    _ = win.run(jsCommand[0..jsCommand.len-1:0]);
    webui.wait();
    webui.clean();
}

/// Returns the content of the configuration file at the given path.
fn getConfig(allocator: std.mem.Allocator, path: []const u8) ![]const u8 {
    const file = std.fs.cwd().readFile(allocator, path, 1000);
    return file;
}