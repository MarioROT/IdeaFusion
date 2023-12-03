const express = require('express');
const fs = require('fs');
const { OpenAI } = require('openai');
const axios = require('axios');
const say = require('say');
const cheerio = require('cheerio');
const path = require('path');
// const open = require('open');
const { exec } = require('child_process');

const app = express();
const port = 3000;

const openai = new OpenAI({ apiKey: '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' });

app.use(express.static('public'));


app.get('/load', (req, res) => {
    const { functionName, params } = req.query;
    // const params = req.query.params ? JSON.parse(req.query.params) : [];
    // Open the default browser with the specified URL
    exec(`start http://localhost:${port}/index.html?functionName=${functionName}&params=${params}`);
    
    // Send a response to the client
    res.send('Function execution initiated.');
});


app.get('/generate-mindmap', async (req, res) => {
    const query = req.query.query;
    console.log(query)

    if (!query) {
        res.status(400).send('Please provide a query.');
        return;
    }

    console.log(query)

    const mindMapContent = await createMindMap(query);

    const mindMapFilePath = 'public/mindmap.json';
    fs.writeFileSync(mindMapFilePath, mindMapContent);

    res.send('Mind map generated and saved.');
});


app.get('/displayText', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        res.status(400).json({ error: 'Please provide a query.' });
        return;
    }

    const mindMapContent = await createSummary(query);

    res.json({ mindMapContent });
});

app.get('/keywords', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        res.status(400).json({ error: 'Please provide a query.' });
        return;
    }

    const mindMapContent = await createKeywords(query);

    res.json({ mindMapContent });
});

app.get('/translation', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        res.status(400).json({ error: 'Please provide a query.' });
        return;
    }

    const mindMapContent = await createTranslation(query);

    res.json({ mindMapContent });
});

app.get('/definition', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        res.status(400).json({ error: 'Please provide a query.' });
        return;
    }

    const mindMapContent = await createDefinition(query);

    res.json({ mindMapContent });
});

app.get('/sendTelegramNote', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        res.status(400).json({ error: 'Please provide a query.' });
        return;
    }

    const mindMapContent = await sendTelegramMessage(query);

    res.json({ mindMapContent });
});

app.get('/readOutloud', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        res.status(400).json({ error: 'Please provide a query.' });
        return;
    }

    const mindMapContent = await speakText(query);

    res.json({ mindMapContent });
});

app.get('/search', async (req, res) => {
  const searchQuery = req.query.query;
  const numImages = 5;
  try {
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`);
    const $ = cheerio.load(response.data);
    const imageUrls = $('img').slice(1, numImages + 1).map((i, img) => $(img).attr('src')).get();
    res.json(imageUrls);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching images');
  }
});




async function createMindMap(query) {

  const prompt = `Given the topic of ${query} and additional information [ADDITIONAL INFO], create a mind map in JavaScript format.

{
  "label": "[TOPIC]",
  "annotations": [
    {
      "url": "[OPTIONAL URL]",
      "attrs": {
        "fill": "[COLOR HEX]",
        "cursor": "pointer",
        "text-decoration": "underline",
        "event": "element:url:pointerdown",
        "data-url": "[OPTIONAL URL]"
      },
      "start": [URL START INDEX],
      "end": [URL END INDEX]
    }
  ],
  "image": "assets/[TOPIC].svg",
  "children": [
    {
      "label": "[SUBTOPIC 1]",
      "userColor": IDEA_USER_COLORS[0],
      "image": "assets/[SUBTOPIC 1].svg",
      "direction": "[DIRECTION]",
      "children": [
        { "label": "[DETAIL 1]" },
        { "label": "[DETAIL 2]" }
        // Additional details
      ]
    }
    // Additional subtopics
  ]
}


Replace [TOPIC] with the main topic of the mind map. [OPTIONAL URL] and [DATE] can be used to provide a reference link and a date, respectively.

Each [SUBTOPIC] represents a major category or aspect of the main topic. [DETAIL] under each subtopic should be specific points or elements relevant to that subtopic. [DIRECTION] indicates the positioning of the subtopic node and can be 'R' (right) or 'L' (left).

For additional information [ADDITIONAL INFO], integrate it into the relevant subtopics or as new subtopics and details.`;


// Send 'prompt' to the OpenAI API and handle the response...
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
    });


    return stream.choices[0].message.content;
}


async function createSummary(query) {

  const prompt = `I want to create a summary of the following text ${query}`;

// Send 'prompt' to the OpenAI API and handle the response...
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
    });

    return stream.choices[0].message.content;
}

async function createKeywords(query) {

  const prompt = `I want to extract the keywords of the following text ${query} and display them in a list`;

// Send 'prompt' to the OpenAI API and handle the response...
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
    });

    return stream.choices[0].message.content;

}

async function createTranslation(query) {

  const prompt = `Translate the following text ${query} to french`;

// Send 'prompt' to the OpenAI API and handle the response...
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
    });
    return stream.choices[0].message.content;
}

async function createDefinition(query) {

  const prompt = `Can you explain the following to me ${query} in one paragraph`;

// Send 'prompt' to the OpenAI API and handle the response...
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
    });
    return stream.choices[0].message.content;
}


async function sendTelegramMessage(text) {

    const apiUrl = "https://api.telegram.org/bot5893184870:AAFCHC2w9qQxoV7jOxKQWzOTBl-Coo0YFL4/sendMessage";
    axios.post(apiUrl, {
        chat_id: "-4043840144",
        text: text
    })
    .then(response => {
        console.log("Message sent");
    })
    .catch(error => {
        console.error("Error sending message:", error);
    });
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

async function speakText(text) {
    say.speak(text, 'Microsoft Zira Desktop', 1);
}

const fetchImages = async (searchQuery) => {
  try {
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`);
    const $ = cheerio.load(response.data);
    const imageUrls = $('img').slice(1, 5 + 1).map((i, img) => $(img).attr('src')).get();

    imageUrls.forEach((url, index) => {
      axios({ url, responseType: 'arraybuffer' })
        .then(response => {
          fs.writeFileSync(path.join(folderPath, `image_${index}.jpg`), response.data);
        })
        .catch(console.error);
    });
  } catch (error) {
    console.error(error);
  }
};

// Usage
// speakText("Hello, I am speaking this text out loud.");

const availableVoices = say.getVoices();
console.log(availableVoices);
