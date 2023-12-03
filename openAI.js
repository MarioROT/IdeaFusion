const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: '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' });

async function main() {
  const p = `Change the elements of this object to be about ${process.argv["2"]}:

{
    label: 'Business Plan\nwww.example.com\n\n2022',
    annotations: [
        {
            'url': 'www.example.com',
            'attrs': {
                'fill': '#4666E5',
                'cursor': 'pointer',
                'text-decoration': 'underline',
                'event': 'element:url:pointerdown',
                'data-url': 'www.example.com'
            },
            'start': 14,
            'end': 29
        }
    ],
    image: 'assets/plan.svg',
    children: [
        {
            label: 'Product',
            userColor: IDEA_USER_COLORS[0],
            image: 'assets/product.svg',
            direction: 'R',
            children: [
                { label: 'Customer Service' },
                { label: 'Development' },
            ],
        },
        {
            label: 'Sales',
            userColor: IDEA_USER_COLORS[1],
            image: 'assets/sales.svg',
            direction: 'R',
            children: [
                { label: 'Tracking' },
                { label: 'Inventory' },
            ],
        },
        {
            label: 'Administration',
            userColor: IDEA_USER_COLORS[2],
            image: 'assets/administration.svg',
            direction: 'L',
            children: [
                { label: 'HR' },
                { label: 'Recruitment' },
                { label: 'Management' },
            ],
        },
        {
            label: 'Finance',
            userColor: IDEA_USER_COLORS[1],
            image: 'assets/finance.svg',
            direction: 'L',
            children: [
                { label: 'Investment' },
                { label: 'Payroll' },
                { label: 'Shares' },
            ],
        },
        {
            label: 'Marketing',
            userColor: IDEA_USER_COLORS[2],
            image: 'assets/marketing.svg',
            direction: 'R',
            children: [
                { label: 'SEO' },
                { label: 'Blog / Website' },
                { label: 'Social Media' },
                { label: 'Press Release' },
            ],
        }
    ],
} 

dont modify useColor parameter content, dont add images
`;

    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: p }],
        stream: false,
    });
    // for await (const chunk of stream) {
    //     process.stdout.write(chunk.choices[0]?.delta?.content || "");
    // }
    console.log(stream.choices[0].message.content)
}

main();

