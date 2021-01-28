import fs from 'fs';
import path from 'path';
import util from 'util';

const ENCODING_UTF8    = 'utf8';
const INPUT_FILE_PATH  = path.join(__dirname, '../data.json');
const OUTPUT_FILE_PATH = path.join(__dirname, '../data-transformed.json');

export const ERROR_MSG = {
    readFileError : 'Error occurred when read data from file',
    writeFileError: 'Error occurred when write data to file',
    parseJsonError: 'Error occurred when parse json data',
}

interface OrderItem  {
    quantity : number,
    price    : number,
    item    ?: string,
    revenue ?: number
}

interface Order {
    [key: string]: OrderItem;
} 

interface InputRecord {
    id      : number,
    vendor  : string,
    date    : string,
    order   : Order,
    customer: Customer,
}

interface TransformedOrder {
    id      : number,
    vendor  : string,
    date    : string,
    customer: string,
    order   : OrderItem[]
}

interface Customer {
    id     : string,
    name   : string,
    address: string
}

interface TransformedRecord {
    customers: Customer[],
    orders   : TransformedOrder[],
}

export const readFile  = (fileName: string) => util.promisify(fs.readFile)(fileName, ENCODING_UTF8);
export const writeFile = (fileName: string, data: string) => util.promisify(fs.writeFile)(fileName, data, ENCODING_UTF8);
export const parseJson = (data: string) => { 
    try {
        JSON.parse(data) 
    } catch (error) {
        throw ERROR_MSG.parseJsonError
    }
    return JSON.parse(data);
};
export const transformOrder = async (order: Order) => {

    let orderItems: OrderItem[] = [];

    for await (const key of Object.keys(order)) {
        orderItems.push({
            item    : key,
            quantity: order[key].quantity,
            price   : order[key].price,
            revenue : order[key].price * order[key].quantity
        });
    }

    return orderItems;
}

export const transfromInputRecords = async (records: InputRecord[]): Promise<TransformedRecord> => {
    let customers: Customer[]      = [];
    let orders: TransformedOrder[] = [];
    
    for (const {order, customer, ...meta} of records) {
        customers.push(customer);
        const customerOrderItems = await transformOrder(order)
        orders.push(
            Object.assign(
                {order: customerOrderItems, customer: customer.id}, 
                meta
            )
        );  
    }

    return new Promise((resolve) => {
        resolve({
            customers,
            orders
        });
    });
}

export const start = async (inputFile: string, outputFile: string) => {
    
    try {

        const fileData               = await readFile(inputFile).catch(() => { throw ERROR_MSG.readFileError });
        const records: InputRecord[] = parseJson(fileData);
        const transformedRecords     = await transfromInputRecords(records);
        await writeFile(outputFile, JSON.stringify(transformedRecords)).catch(() => { throw ERROR_MSG.writeFileError });
    
    } catch (e) {

        console.log(e);
    
    }

}

start(INPUT_FILE_PATH, OUTPUT_FILE_PATH);