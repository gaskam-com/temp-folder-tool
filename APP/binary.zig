const std = @import("std");
var GPA = std.heap.GeneralPurposeAllocator(.{}){};
const allocator = GPA.allocator();

const StartCharacter = 0b1111111;
const EndCharacter = 0b1111110;

const characters = "abcdefghijklmnopqrstuvwxyz123456789àáâãäåæçèéêëìíîïðñòóôõöøœùúûüýÞþß!#$%&'()+,-.;=@[]^`{}~ -/";
const bytes = 7;

const ToEncode = "/qmljfae qsdfmljaf-lahfecatcatcatcatcatcatcat.jpg";

pub fn main() !void {
    var output = std.ArrayList(u8).init(allocator);
    defer output.deinit();
    var spaceLeft: u3 = 0;
    for (ToEncode) |character| {
        if (spaceLeft == 0) {
            try output.append(@as(u8, @truncate(std.mem.indexOf(u8, characters, &[1]u8{character}) orelse 0)));
        } else {
            std.debug.print("{d}\n", .{character});
            const value = @as(u8, @truncate(std.mem.indexOf(u8, characters, &[1]u8{character}) orelse 0));
            try output.append(output.pop() | @shlWithOverflow(value, @as(u3, @truncate(8 - @as(u4, spaceLeft))))[0]);
            try output.append(value >> spaceLeft);
        }
        spaceLeft = 8 - bytes +% spaceLeft;
    }
    std.debug.print("{s}", .{output.items});
}
