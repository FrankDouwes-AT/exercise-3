import {defineEventHandler, getQuery} from 'h3'
import findClosestValues from "../../utils/find-closest-values";
import {TClosestValuesParams} from "~/utils/find-closest-values/types";

export default defineEventHandler(async (event) => {

    const data = await readBody(event)

    if (data) {
        const inputData: TClosestValuesParams = JSON.parse(data)
        return findClosestValues(inputData)
    }

    // depending on what this thing actually is: either give a detailed response, or limited info.
    throw createError({
        statusCode: 400,
        statusMessage: 'Missing data!',
    })
})
