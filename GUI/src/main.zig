const webui = @import("webui");
const std = @import("std");

pub fn main() !void {
    std.debug.print("Starting GUI...\n", .{});

    if (webui.interfaceIsAppRunning()) {
        std.debug.print("App is already running.\n", .{});
        return;
    }

    webui.setConfig(.folder_monitor, true);
    webui.setConfig(.use_cookies, true);
    var win = webui.newWindow();

    // const allocator = std.heap.page_allocator;
    var buffer: [std.fs.MAX_PATH_BYTES]u8 = undefined;

    const length = (try std.fs.realpath("./src/ui", &buffer)).len;
    buffer[length] = 0;
    const path = buffer[0..length:0];

    const my_icon = "<svg>...</svg>";
    const my_icon_type = "image/svg+xml";

    const port: usize = webui.getFreePort();

    _ = win.setPort(port);
    _ = win.setRootFolder(path);
    _ = win.setSize(800, 400);
    _ = win.setMinimumSize(800, 400);
    _ = win.setPosition(100, 100);
    _ = win.setIcon(my_icon, my_icon_type);

    _ = win.bind("update_folders", updateFolders);
    _ = win.bind("change_config", changeConfig);
    _ = win.bind("close_app", close);

    _ = win.show("index.html");

    if (webui.isShown(win)) {
        std.debug.print("Window is now shown.\n", .{});
    }

    std.debug.print("TempFolder is running on http://localhost:{any}\n", .{webui.getPort(win)});

    webui.wait();
    webui.close(win);
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

fn changeConfig(event: *webui.Event) void {
    const newConfig = event.getString();
    const path = "../APP/config.json";
    std.fs.cwd().writeFile(.{ 
        .sub_path = path,
        .data = newConfig
    }) catch |e| {
        std.debug.print("Unable to write config at path: {s}\n", .{path});
        std.debug.print("Error: {}\n", .{e});
        std.process.exit(1);
    };
}

fn close(_: *webui.Event) void {
    std.debug.print("Exit.\n", .{});

    // Close all opened windows
    webui.exit();
    webui.clean();
}

/// Returns the content of the configuration file at the given path.
fn getConfig(buffer: []u8, path: []const u8) ![]const u8 {
    const file = std.fs.cwd().readFile(path, buffer);
    return file;
}