import Redis from 'ioredis'
import { promisify } from 'util';

const redisClient = new Redis(6379, 'redis');

function getRedis(value:string){
    const syncRedisGet = promisify(redisClient.get).bind(redisClient);
    return syncRedisGet(value);
}

function setRedis(key: string, value:string){
    const syncRedisSet = promisify(redisClient.set).bind(redisClient);
    return syncRedisSet(key, value);
}

function delRedis(key: string){
    const syncRedisSet = promisify(redisClient.del).bind(redisClient);
    return syncRedisSet(key)
}
export {redisClient, getRedis, setRedis, delRedis}