import {RepoResult} from "./getUserRepos";

/**
 * Fetch the text of the given repository's readme.md
 *
 * @export
 * @param {RepoResult} repo
 * @returns {Promise<string>}
 */
export function getReadMe(repo: RepoResult): Promise<string> {
    return new Promise<string>(async(resolve: (value: string) => void, reject) => {
        try
        {
            await fetch(`https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/master/README.md`).then(async(response) => { return resolve(await response.text()); });
        }
        catch (err)
        {
            console.log(err);
            return resolve("");
        }
    });
}