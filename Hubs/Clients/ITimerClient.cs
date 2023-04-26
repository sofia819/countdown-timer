using System.Threading.Tasks;
using Timer.Entities;

namespace Timer.Hubs.Clients
{
    public interface ITimerClient
    {
        Task ReceiveTimerCountdown(double secondsUntil);
    }
}