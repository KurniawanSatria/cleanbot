const fs = require("fs");
const path = require("path");
const https = require("https");
const { URL } = require("url");

const config = require("../config.json");
const logPath = path.resolve(__dirname, "..", config.logFile);

function timestamp() {
    return new Date().toISOString();
}

function log(msg) {
    const line = `[${timestamp()}] ${msg}\n`;
    process.stdout.write(line);
    fs.appendFileSync(logPath, line);
}

function sendDiscord(content) {
    if (!config.discordWebhook) return;
    const url = new URL(config.discordWebhook);
    const data = JSON.stringify({
        flags: 32768,
        components: [
            {
                type: 17,
                accent_color: null,
                components: [
                    {
                        type: 10,
                        content: "### Scheduled Task\n"
                    },
                    {
                        type: 14
                    },
                    {
                        type: 10,
                        content
                    },
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 5,
                                label: "Join My Server",
                                url: "https://dsc.gg/kindred-circle"
                            },
                            {
                                type: 2,
                                style: 5,
                                label: "Developer",
                                url: "https://saturia.online"
                            }
                        ]
                    }
                ]
            }
        ]
    });
    const req = https.request(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
    });
    req.on("error", (e) => log(`Discord webhook error: ${e.message}`));
    const chunks = [];
    req.on("response", (res) => {
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
            if (res.statusCode >= 400) log(`Discord webhook ${res.statusCode}: ${Buffer.concat(chunks).toString()}`);
        });
    });
    req.end(data);
}

function report(lines) {
    if (!lines.length) return;
    const msg = lines.join("\n");
    log(msg);
    const trimmed = msg.length > 1900 ? msg.slice(0, 1900) + "\n...(truncated)" : msg;
    sendDiscord(trimmed);
}

module.exports = { log, report };
