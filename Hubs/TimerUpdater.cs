using Microsoft.AspNetCore.SignalR;
using Timer.Entities;

namespace Timer.Hubs
{
    public class TimerUpdater : BackgroundService
    {
        private readonly IHubContext<TimerHub> hubContext;
        private TargetTime targetTime;

        public TimerUpdater(IHubContext<TimerHub> hubContext)
        {
            this.hubContext = hubContext;
            targetTime = GetTargetTime();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                DateTimeOffset currentTime = DateTimeOffset.Now;
                // If target time has passed, refresh
                if (targetTime.Timestamp < currentTime)
                {
                    targetTime = GetTargetTime();
                }

                // Get the seconds until countdown finishes
                await hubContext.Clients.All.SendAsync("ReceiveTimerCountdown", targetTime.Timestamp - currentTime);

                await Task.Delay(1000);
            }
        }

        private static TargetTime GetTargetTime()
        {
            return new TargetTime() { Timestamp = DateTimeOffset.Now.AddSeconds(5) };
        }
    }
}