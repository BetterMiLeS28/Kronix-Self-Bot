const userSchedules = new Map(); // Persistent storage for schedules (in-memory)

module.exports = {
  name: 'schedule',
  async execute(message, args, config) {
    const subCommand = args[0];

    if (!subCommand) {
      return message.channel.send('```Usage: schedule <add/view/delete> [details]```');
    }

    switch (subCommand.toLowerCase()) {
      case 'add': {
        const scheduleDetails = args.slice(1).join(' ');
        if (!scheduleDetails) {
          return message.channel.send('```Please provide details for the schedule.```');
        }

        if (!userSchedules.has(message.author.id)) {
          userSchedules.set(message.author.id, []);
        }

        const userSchedule = userSchedules.get(message.author.id);
        userSchedule.push(scheduleDetails);
        userSchedules.set(message.author.id, userSchedule);

        return message.channel.send('```Schedule added successfully!```');
      }

      case 'view': {
        const userSchedule = userSchedules.get(message.author.id) || [];
        if (userSchedule.length === 0) {
          return message.channel.send('```You have no scheduled tasks.```');
        }

        return message.channel.send(
          '```Your schedule:\n' +
          userSchedule.map((task, index) => `${index + 1}. ${task}`).join('\n') +
          '```'
        );
      }

      case 'delete': {
        const scheduleIndex = parseInt(args[1], 10);
        if (isNaN(scheduleIndex) || scheduleIndex < 1) {
          return message.channel.send('```Please provide a valid schedule number to delete.```');
        }

        const userSchedule = userSchedules.get(message.author.id) || [];
        if (scheduleIndex > userSchedule.length) {
          return message.channel.send('```Invalid schedule number.```');
        }

        userSchedule.splice(scheduleIndex - 1, 1);
        userSchedules.set(message.author.id, userSchedule);

        return message.channel.send('```Schedule deleted successfully!```');
      }

      default:
        return message.channel.send('```Unknown subcommand. Use add/view/delete.```');
    }
  },
};
