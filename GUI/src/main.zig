const webui = @import("webui");
const std = @import("std");

pub fn main() !void {
    webui.setConfig(.folder_monitor, true);
    var win = webui.newWindow();

    // const allocator = std.heap.page_allocator;
    var buffer: [std.fs.MAX_PATH_BYTES]u8 = undefined;

    const length = (try std.fs.realpath("./src/ui", &buffer)).len;
    buffer[length] = 0;
    const path = buffer[0..length:0];

    _ = win.setPort(24568);
    _ = win.setMinimumSize(800, 400);
    _ = win.setRootFolder(path);
    _ = win.bind("update_folders", updateFolders);
    _ = win.bind("close_app", close);
    _ = win.show("index.html");

    webui.wait();
    webui.clean();
}

fn updateFolders(event: *webui.Event) void {
    var buffer: [1000]u8 = undefined;
    const path = "../APP/config.json";
    const fileContent = getConfig(&buffer, path) catch |e| {
        std.debug.print("Unable to read config at path: {s}\n", .{path});
        std.debug.print("Error: {}\n", .{e});
        std.process.exit(1);
    };
    buffer[fileContent.len] = 0;
    event.returnString(buffer[0..fileContent.len:0]);
}

fn close(_: *webui.Event) void {
    std.debug.print("Exit.\n", .{});

    // Close all opened windows
    webui.exit();
}

/// Returns the content of the configuration file at the given path.
fn getConfig(buffer: []u8, path: []const u8) ![]const u8 {
    const file = std.fs.cwd().readFile(path, buffer);
    return file;
}