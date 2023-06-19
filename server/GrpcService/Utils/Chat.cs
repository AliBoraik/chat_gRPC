using System.Collections.Concurrent;
using Example;
using Grpc.Core;
using GrpcService.Interfaces;

namespace GrpcService.Utils
{
    public class Chat :  IChat
    {
        private readonly ConcurrentDictionary<string, IServerStreamWriter<Message>> _users = new();

        public void Join(string name, IServerStreamWriter<Message> response) => _users.TryAdd(name, response);
        public async Task BroadcastMessageAsync(Message message) => await BroadcastMessages(message);

        private async Task BroadcastMessages(Message message)
        {
            foreach (var user in _users.Where(x => x.Key != message.User))
            {
                await SendMessageToSubscriber(user, message);
            }
        }

        private async Task SendMessageToSubscriber(KeyValuePair<string, IServerStreamWriter<Message>> user, Message message)
        {
            try
            {
                await user.Value.WriteAsync(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }
        public void Remove(string name)  => _users.TryRemove(name, out _);
    }
}