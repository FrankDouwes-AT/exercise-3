/*
The reason to turn this into a service is to have all API logic in 1 place,
it's very tempting (and also inline with "component based" thinking) to let each component do its own data fetching,
but the result is scattered API logic (which is generally at the core of the app),
having it all in one place helps with debugging & maintainability of large codebases.
*/
import {type ExtractedRouteMethod, type TypedInternalResponse} from "nitropack";
import type {_AsyncData} from "#app/composables/asyncData";
import type {NuxtError} from "#app";
import type {TClosestValuesParams} from "~/utils/find-closest-values/types";

// We use a namespace as a basic grouping mechanism, we could also use separate methods, personal preference.
export namespace NuxtApi {
    export async function getClosestValues (data: TClosestValuesParams): Promise<_AsyncData<any, Error | NuxtError<undefined> | null>> {
        return _useAPIPost('/api/find-closest-values/', data)
    }

    /*
        Again, this is a way to funnel all POST logic into the same useAsyncData() call, the _ indicating a private method (to discourage direct usage)
        This is tweaked code from the AT Portal (since I made it)
     */
    function _useAPIPost (url: string, data: object, server = true): Promise<TypedInternalResponse<string, _AsyncData<any, Error | NuxtError<undefined> | null>, ExtractedRouteMethod<string, any>>> {

        const options: any = {
            method: 'POST',
            body: data,
            cache: 'no-store',
            mode: 'no-cors',
            server
        }

        /*
           useAsyncData() with a $fetch() gives the most options, but also has the most boilerplate.
           TODO: for some reason this is no longer the way to go since Feb/March of this year,
           see: https://github.com/nuxt/nuxt/discussions/25602, they seem to want to force a $fetch for each component,
           or write a custom useFetch() composable: https://nuxt.com/docs/guide/recipes/custom-usefetch,
           People (including myself) doubt this a good approach, so I'll just leave this as is for now.
        */
        return useAsyncData(`nuxtApiPost_${url}`, () => {

            // this is always a good idea, so you can easily debug API calls
            if (process.dev) {
                const executedBy = process.client ? 'client' : 'server'
                console.info(`ℹ (${executedBy}) URL: ${url}`)
            }

            return $fetch(url, options)
        })
    }
}