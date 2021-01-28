import { readFile, writeFile, parseJson, transformOrder, transfromInputRecords, start } from '../src';
import fs from 'fs';
import path from 'path';

describe('Running unit tests: ', () => {

    it('readFile', async () => {
        const response = await readFile('./data.json');
        expect(response).toBeDefined;
        expect(fs.readFileSync('./data.json', 'utf8')).toBe(response);
    });

    it('writeFile', async () => {

        const output_path = './data-output.json';
        await writeFile(output_path, '{"id": 1, "vendor": "acme"}');

        expect(fs.existsSync(output_path)).toBe(true);
        expect(fs.readFileSync(output_path, 'utf8')).toBe('{"id": 1, "vendor": "acme"}');
    });

    it('parseJson', async () => {
        const data = parseJson('{"id": 1, "vendor": "acme"}');
        expect(data).toEqual({ id: 1, vendor: "acme" });
    });


    it('transformOrder', async () => {
        const orderData = {
            "cake": {
                "quantity": 8,
                "price": 1
            },
            "punch": {
                "quantity": 19,
                "price": 7
            },
            "bouncy house": {
                "quantity": 4,
                "price": 9
            }
        };
        const transformedOrderData = await transformOrder(orderData);
        expect(transformedOrderData).toEqual([
            {
                "item": "cake",
                "quantity": 8,
                "price": 1,
                "revenue": 8
            },
            {
                "item": "punch",
                "quantity": 19,
                "price": 7,
                "revenue": 133
            },
            {
                "item": "bouncy house",
                "quantity": 4,
                "price": 9,
                "revenue": 36
            }
        ]);
    });


    it('transfromInputRecords', async () => {
        const rawData = [
            {
                "id": 1,
                "vendor": "acme",
                "date": "03/03/2017",
                "customer": {
                    "id": "8baa6dea-cc70-4748-9b27-b174e70e4b66",
                    "name": "Lezlie Stuther",
                    "address": "19045 Lawn Court"
                },
                "order": {
                    "hat": {
                        "quantity": 14,
                        "price": 8
                    },
                    "cake": {
                        "quantity": 9,
                        "price": 3
                    },
                    "ice": {
                        "quantity": 10,
                        "price": 5
                    },
                    "candy": {
                        "quantity": 6,
                        "price": 8
                    }
                }
            }];

        const transformedData = await transfromInputRecords(rawData);

        expect(transformedData).toEqual({
            "customers": [
                {
                    "id": "8baa6dea-cc70-4748-9b27-b174e70e4b66",
                    "name": "Lezlie Stuther",
                    "address": "19045 Lawn Court"
                }
            ],
            "orders": [
                {
                    "id": 1,
                    "vendor": "acme",
                    "date": "03/03/2017",
                    "customer": "8baa6dea-cc70-4748-9b27-b174e70e4b66",
                    "order": [
                        {
                            "item": "hat",
                            "quantity": 14,
                            "price": 8,
                            "revenue": 112
                        },
                        {
                            "item": "cake",
                            "quantity": 9,
                            "price": 3,
                            "revenue": 27
                        },
                        {
                            "item": "ice",
                            "quantity": 10,
                            "price": 5,
                            "revenue": 50
                        },
                        {
                            "item": "candy",
                            "quantity": 6,
                            "price": 8,
                            "revenue": 48
                        }
                    ]
                }
            ]
        });
    });

    it('start', async () => {

        const INPUT_FILE_PATH  = path.join(__dirname, '../data.json');
        const OUTPUT_FILE_PATH = path.join(__dirname, '../test-output.json');

        await start(INPUT_FILE_PATH, OUTPUT_FILE_PATH);

        expect(fs.existsSync(path.join(__dirname, '../test-output.json'))).toBe(true);


    });

});