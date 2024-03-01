using Microsoft.AspNetCore.SignalR;

namespace Hooked.Api.Hubs;

public class VCallSignalHub : Hub
{
    private static HashSet<string> _users = [];
    private static Dictionary<string, string> _rooms = new();

    public override async Task OnDisconnectedAsync(Exception exc)
    {
        _users.Remove(Context.ConnectionId);
        await base.OnDisconnectedAsync(exc);
    }

    public async Task Initiate()
    {
        var client1 = Context.ConnectionId;
        _users.Add(client1);

        if (_users.Count <= 1) return;
        
        while (true)
        {
            if (_users.Any(x => x != client1))
            {
                var client2 = _users.FirstOrDefault(x => x != client1);
                _rooms.Add(client1, client2);
                _rooms.Add(client2, client1);
                _users.Remove(client1);
                _users.Remove(client2);
                await Clients.Client(client1).SendAsync("Matched");
                break;
            }
        }
    }

    public async Task SendOffer(string offer)
    {
        var target = _rooms[Context.ConnectionId];
        await Clients.Client(target).SendAsync("OfferReceived", offer);
    }

    public async Task SendAnswer(string answer)
    {
        var target = _rooms[Context.ConnectionId];
        await Clients.Client(target).SendAsync("AnswerReceived", answer);
    }
    
    public async Task SendIceCandidate(string candidate)
    {
        var target = _rooms[Context.ConnectionId];
        await Clients.Client(target).SendAsync("ReceivedIceCandidate", candidate);
    }
}   