using Microsoft.AspNetCore.SignalR;
using Timer.Entities;
using Timer.Hubs.Clients;

namespace Timer.Hubs
{
    public class TimerHub : Hub<ITimerClient>
    {

        public async Task SendTimerCountdown(TimeSpan timeUntil)
        {
            await Clients.All.ReceiveTimerCountdown(timeUntil.TotalSeconds);
        }
    }
}