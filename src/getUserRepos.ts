const $ = require("jquery");

import { SearchResult } from "./searchBox";
import { CLIENT_ID, CLIENT_SECRET } from "./ghAppSettings";

export interface RepoResult
{
    html_url : string;
    name : string;
    owner : SearchResult;
}

async function getUserReposByPage(user : SearchResult,page : number) : Promise<Array<RepoResult>>
{
    return new Promise<Array<RepoResult>>((resolve : (value : Array<RepoResult>) => void) => {
        let URL = `https://api.github.com/users/${user.login}/repos?page=${page}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
        $.ajax({
            url: URL,
            jsonp: true,
            method: "GET",
            dataType: "json",
            success: function(res : any) {
              resolve(res);
            }
          });
    });
}

export async function* getUserRepos(user : SearchResult)
{
    for(let i = 1; i != 100; ++i)
    {
        let result : Array<RepoResult> = new Array<RepoResult>();
        try
        {
             result = await getUserReposByPage(user,i);
        }
        catch(err)
        {
            console.log(err);
            return;
        }
        console.log(result);
        yield result;
    }

}