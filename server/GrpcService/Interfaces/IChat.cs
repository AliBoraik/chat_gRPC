using Example;
using Grpc.Core;

namespace GrpcService.Interfaces;

public interface IChat
{
    void Join(string name, IServerStreamWriter<Message> response);
    Task BroadcastMessageAsync(Message message);
    public void Remove(string name);
}