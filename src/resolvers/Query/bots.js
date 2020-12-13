const Bot = require("../../models/Bot");
const fetchBot = require('../../util/fetchBot')
const _ = require('lodash')

module.exports = async (parent, {page=1, sort, queryType, query}) => {
    /**
     * @type {Array}
     */
    let bot = await Bot.find({approved: true})
    await Promise.all(bot.map(fetchBot))
    switch (sort) {
        case 'servers':
            bot.sort((a, b) => b.guilds-a.guilds)
            break
        default:
        case 'hearts':
            bot.sort((a, b) => b.heartCount-a.heartCount)
            break
    }

    if (queryType && query) {
        switch (queryType) {
            case 'plain':
                bot = bot.filter(r => r.tag.includes(query) || r.name.includes(query) || r.brief.includes(query) || r.description.includes(query) || r.id === query)
                break
            case 'regex':
                query = new RegExp(query)
                bot = bot.filter(r => query.test(r.name) || query.test(r.brief) || query.test(r.description) || query.test(r.tag))
                break
        }
    }

    const chunked = _.chunk(bot, 12)
    return {
        pages: chunked.length,
        result: chunked[page-1] || []
    }
}