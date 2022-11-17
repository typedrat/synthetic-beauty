import { IncomingHttpHeaders } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { request } from 'undici';

function flatten_components_to_path(components: string | string[] | undefined): string {
    if (typeof components === 'string') {
        return components;
    }
    else if (components === undefined) {
        return '';
    }
    else {
        return components.join('/');
    }
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handler(proxyRequest: NextApiRequest, proxyResponse: NextApiResponse) {
    const queryParameters = new URL(proxyRequest.url || '', `http://${proxyRequest.headers.host}`).searchParams;

    if (!queryParameters.has('__host')) {
        proxyResponse.status(400).send(
            "The proxyRequest is malformed. `__host` must be included in the query string."
        );

        return;
    }
    const host = queryParameters.get('__host');
    queryParameters.delete('__host');

    const path = flatten_components_to_path(proxyRequest.query.pathComponents);
    let targetUrl = new URL(path, `https://${host}`);

    let targetHeaders: IncomingHttpHeaders = JSON.parse(queryParameters.get('__headers') || '{}');
    targetHeaders.range = proxyRequest.headers.range;
    queryParameters.delete('__headers');

    queryParameters.forEach((value, key) => targetUrl.searchParams.append(key, value));

    const targetResult = await request(targetUrl, { body: proxyRequest.body, headers: targetHeaders });

    [
        'content-length',
        'content-type',
        'content-disposition',
        'accept-ranges',
        'content-range'
    ].forEach(key => {
        const value = targetResult.headers[key];

        if (value !== undefined) {
            proxyResponse.setHeader(key, value);
        }
    });

    proxyResponse.statusCode = targetResult.statusCode;
    targetResult.body.pipe(proxyResponse);
}
