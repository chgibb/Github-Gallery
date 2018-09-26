/**
 * Returns an array of image URLs extracted from the given text
 *
 * @export
 * @param {string} text
 * @returns {Array<string>}
 */
export function getImageURLs(text: string): Array<string>
{
    let res = new Array<string>();

    let imgURLRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
    let matches = text.match(imgURLRegex);
    if(matches)
    {
        for(let i = 0; i != matches !.length; ++i)
        {
            res.push(matches ![i]);
        }
    }

    return res;
}
