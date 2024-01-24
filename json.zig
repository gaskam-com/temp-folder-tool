const std = @import("std");

const file_path = "config.json";

const Config = struct { tempFolderPath: []const u8, retentionPeriod: u32 };

pub fn main() !void {
    var buffer: [3000]u8 = undefined;
    var fba = std.heap.FixedBufferAllocator.init(&buffer);
    const allocator = fba.allocator();

    const memory = try allocator.alloc(u8, 3000);

    const file = std.fs.cwd().readFile(file_path, memory) catch |err| {
        std.debug.print("Unable to read file: {}\n", .{err});
        return;
    };
    allocator.free(memory);

    std.debug.print("File contents: {s}\n", .{file});

    const parsed = std.json.parseFromSlice(Config, allocator, file, .{}) catch |err| {
        std.debug.print("Unable to parse file: {}\n", .{err});
        return;
    };
    _ = parsed;
}
