const { Client, logger } = require('./lib/client')
const { DATABASE, VERSION } = require('./config')
const { stopInstance } = require('./lib/pm2')

const start = async () => {
  logger.info(`levanter ${VERSION}`)

  // Debug environment variables for platform detection
  logger.info(`Detected PLATFORM: ${process.env.PLATFORM || 'Unknown'}`)
  logger.info(`DIGITALOCEAN: ${process.env.DIGITALOCEAN}`)
  logger.info(`VPS: ${process.env.VPS}`)
  logger.info(`KOYEB: ${process.env.KOYEB}`)

  try {
    await DATABASE.authenticate({ retry: { max: 3 } })
  } catch (error) {
    const databaseUrl = process.env.DATABASE_URL
    logger.error({ msg: 'Unable to connect to the database', error: error.message, databaseUrl })
    return stopInstance()
  }

  try {
    const bot = new Client()
    await bot.connect()
  } catch (error) {
    logger.error(error)
  }
}

start()
