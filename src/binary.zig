const std = @import("std");

const StartCharacter = "";
const EndCharacter = "";

const characters = "abcdefghijklmnopqrstuvwxyz123456789àáâãäåæçèéêëìíîïðñòóôõöøœùúûüýÞþß!#$%&'()+,-.;=@[]^`{}~ -/";

const ToEncode = "/qmljfae qsdfmljaf-lahfefdA.jpg";

pub fn main() !void {
    std.debug.print("{}\n", .{characters.len});
    for (ToEncode) |character| {
        std.mem.indexOf(u8, characters, &[1]u8{character});
    }
}
