import * as React from 'react'
const octokit = require('@octokit/rest')()

export interface SearchResult
{
    login : string;
    avatar_url : string;
    events_url : string;
    repos_url : string;
}

export interface SearchBoxProps
{
    onSearchResults : (res : Array<SearchResult>) => void;
}

export class SearchBox extends React.Component<SearchBoxProps> {
    public timer : NodeJS.Timer;
    public constructor(props : SearchBoxProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <input type="text" placeholder="Search for Users and Orgs" autoFocus={true} onFocus={this.searchUpdated} onChange={this.searchUpdated} />
            </div>
        )
    }

    private searchUpdated = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        if(this.timer)
        {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(async () =>{
            try
            {
                let q = event.target.value;
                const result = await octokit.search.users({
                    q : q
                });
                console.log(result);
                this.props.onSearchResults(result.data.items);
            }
            catch(err)
            {
                this.props.onSearchResults(new Array());
            }
        },500);
    }
}