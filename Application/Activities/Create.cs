using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }

            public class Handler : IRequestHandler<Command>
            {
                public readonly DataContext context;
                public Handler(DataContext context)
                {
                    this.context = context;
                }

                public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                {
                    context.Activities.Add(request.Activity);
                    await context.SaveChangesAsync();
                    return Unit.Value;
                }
            }
        }
    }
}