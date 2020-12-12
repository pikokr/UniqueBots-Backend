const Audit = require("../../models/Audit");
const {ApolloError} = require("apollo-server-errors");
const {evaluate} = require('../../util/bot')
const loginRequired = require('../../middlewares/loginRequired')

module.exports = {
    owner: parent => parent._owner,
    patch: loginRequired(async (parent, args, ctx) => {
        if (parent.owner !== ctx.user.meta.id) throw new ApolloError('봇 소유자만 봇을 수정할 수 있습니다', 'PERMISSION_DENIED')
        if (!args.brief) throw new ApolloError('brief Field required', 'BRIEF_REQUIRED', {
            parameter: 'brier'
        })
        if (!args.description) throw new ApolloError('description Field required', 'DESCRIPTION_REQUIRED', {
            parameter: 'description'
        })

        const b = await evaluate(`
        client.users.fetch(${JSON.stringify(parent.id)}).then(res => {
            return res
        }).catch(e => {
            return false
        })
    `)

        if (!b) throw new ApolloError('봇을 찾을 수 없습니다', 'ERR_BOT_NOT_FOUND')

        const bot = parent

        bot.description = args.description.slice(0, 1500)
        bot.brief = args.brief.slice(0, 50)
        bot.invite = args.invite
        bot.prefix = args.prefix
        bot.tag = b.tag

        await bot.save()

        const audit = new Audit()
        audit.id = ctx.user.meta.id
        audit.msg = `봇 ${b.tag}을(를) 수정함`

        await audit.save()

        return true
    })
}