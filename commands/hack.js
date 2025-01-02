module.exports = {
    name: 'hack',
    async execute(message, args, config) {
        const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const gender = ["Male", "Female", "Trans", "Other"];
        const age = randomRange(10, 25);
        const height = [
            '4\'6\"', '4\'7\"', '4\'8\"', '4\'9\"', '5\'0\"', '5\'2\"', '5\'5\"',
            '5\'7\"', '5\'9\"', '6\'0\"', '6\'2\"', '6\'5\"'
        ];
        const weight = randomRange(60, 300);
        const hairColor = ["Black", "Brown", "Blonde", "Red", "Gray"];
        const skinColor = ["White", "Pale", "Brown", "Black"];
        const religion = ["Christian", "Muslim", "Atheist", "Hindu", "Jewish"];
        const sexuality = ["Straight", "Gay", "Bi-Sexual", "Pansexual"];
        const education = ["High School", "College", "Middle School"];
        const ethnicity = ["White", "Asian", "Latino", "Black", "Indian"];
        const occupation = [
            "Programmer", "Janitor", "Police Officer", "Teacher", "Doctor",
            "Artist", "Salesperson", "Retailer"
        ];
        const salary = [
            "$0", "<$50,000", "$100,000", "$150,000", "$200,000+"
        ];
        const location = [
            "America", "United States", "Europe", "India", "Russia", "Canada"
        ];
        const emailDomains = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com"];
        const dob = `${randomRange(1, 12)}/${randomRange(1, 28)}/${randomRange(1995, 2010)}`;
        const names = [
            "James Smith", "Maria Garcia", "Robert Johnson", "David Lee", "Emma Brown"
        ];
        const phone = `(${randomRange(100, 999)})-${randomRange(100, 999)}-${randomRange(1000, 9999)}`;

        const userId = args.length ? args[0].replace(/[^0-9]/g, '') : null;
        const user = userId ? await message.client.users.fetch(userId).catch(() => null) : message.author;

        if (!user) {
            return message.channel.send('❕ User not found.');
        }

        const hackingSteps = [
            `Hacking ${user.username}...`,
            `Hacking into the mainframe...`,
            `Caching data...`,
            `Cracking SSN information...`,
            `Bruteforcing love life details...`,
            `Finalizing life-span dox details...`
        ];

        let sentMessage = await message.channel.send(hackingSteps[0]);

        for (let i = 1; i < hackingSteps.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await sentMessage.edit(hackingSteps[i]);
        }

        const hackInfo = `
        **Name**: ${randomChoice(names)}
        **Gender**: ${randomChoice(gender)}
        **Age**: ${age}
        **Height**: ${randomChoice(height)}
        **Weight**: ${weight} lbs
        **Hair Color**: ${randomChoice(hairColor)}
        **Skin Color**: ${randomChoice(skinColor)}
        **DOB**: ${dob}
        **Location**: ${randomChoice(location)}
        **Phone**: ${phone}
        **Email**: ${user.username}${randomChoice(emailDomains)}
        **Occupation**: ${randomChoice(occupation)}
        **Salary**: ${randomChoice(salary)}
        **Ethnicity**: ${randomChoice(ethnicity)}
        **Religion**: ${randomChoice(religion)}
        **Sexuality**: ${randomChoice(sexuality)}
        **Education**: ${randomChoice(education)}
        `.trim();

        await sentMessage.edit({
            content: `\`\`\`${hackInfo}\`\`\``
        });
    }
};
