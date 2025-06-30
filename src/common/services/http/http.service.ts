import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { handlerError } from 'src/common/helpers/helper';

@Injectable()
export class HttpService {


    get = async (uri, headers = {}) => {
        try {
            let response = await axios.get(uri, { headers })
            return response;
        } catch (err) {
            console.log(err);
            handlerError(err);
        }
    }

    post = async (uri, headers, body) => {

        try {

            let response = await axios.post(`${uri}`, body, { headers });
            return response;
        }
        catch (err) {
            console.log(err)
            handlerError(err);
        }

    }

    put = async (uri, headers, body) => {
        try {
            let response = await axios.put(`${uri}`, body, { headers });
            return response;
        } catch (err) {
            console.log(err);
            handlerError(err);
        }
    }

    delete = async (uri, headers = {}) => {
        try {

            let response = await axios.delete(uri, { headers })
            return response;
        } catch (err) {
            console.log(err);
            handlerError(err);
        }

    }

}
