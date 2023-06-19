using Example;
using Grpc.Core;
using GrpcService.Interfaces;

namespace GrpcService.Services;

public class ChatService: Chat.ChatBase
{
    private readonly IChat _chat;

    public ChatService(IChat chat)
    {
        _chat = chat;
    }

    public override async Task<Message> send(Message request, ServerCallContext context)
    {
        await _chat.BroadcastMessageAsync(request);
       return request;
    }

    public override Task join(Message request, IServerStreamWriter<Message> responseStream, ServerCallContext context)
    {
        _chat.Join(request.User, responseStream);
        WaitHandle.WaitAny(new[] { context.CancellationToken.WaitHandle });
        _chat.Remove(request.User);
        return Task.CompletedTask;
    }
}