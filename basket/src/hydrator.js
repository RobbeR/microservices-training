const { default: axios } = require("axios");
const cache = require("./cache");

const getProduct = async (productId) => {
    const reply = await cache.get(productId);
    if(reply) {
        console.log(`Product ${productId} loaded from cache...`);
        return JSON.parse(reply);
    }
    
    const serviceResponse = await axios.get(`http://catalog/product/${productId}`);
    const product = serviceResponse.data;
    console.log(`Product ${productId} loaded from service...`);
    cache.set(productId, JSON.stringify(product));
    return product;
};

const hydrateItem = async (productId, count) => {
    const product = await getProduct(productId);
    return {
        product,
        count
    };
}

module.exports = basket => Promise.all(
    Object.keys(basket).map(productId => hydrateItem(productId, basket[productId]))
)