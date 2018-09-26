import * as React from "react";

import { Container, Header } from "gitstar-components";

import { SearchBox, SearchResult } from "./searchBox";
import { getUserRepos } from "./getUserRepos";
import { getReadMe } from "./getReadMe";
import { getImageURLs } from "./getImageURLs";

class App extends React.Component
{
  public state : {
    searchResults : Array<SearchResult>;
    galleryURLs : Array<{imgURL: string,repoURL: string}>;
    stopLoadingGallery : boolean;
  };

  public constructor()
  {
    super({});
    this.state = {
      searchResults: new Array(),
      galleryURLs: new Array(),
      stopLoadingGallery: false
    }
  }

  public render()
  {
    return (
      <Container>
        <Header>
          <div style={{ display: "flex", alignItems: "center" }} />
          <SearchBox onSearchResults={this.onSearchResults} />
          <a href={`https://github.com/chgibb`}>chgibb</a>
        </Header>
        <div>{
          (this.state.stopLoadingGallery == false && this.state.galleryURLs.length == 0) ? (<h3>No Images to Show</h3>) : ""
        }{
            this.state.galleryURLs.map(res => {
              if(this.state.stopLoadingGallery)
                return;
              return (
                <div>
                  <a href={res.repoURL} target="_blank"><img key={res.imgURL} src={res.imgURL} className="activeHover"></img></a>
                </div>
              )
            })
          }</div>
        <div>{
          this.state.searchResults.map(res => {
            if(this.state.stopLoadingGallery == false)
              return;
            return (
              <img key={res.login} className="activeHover" src={res.avatar_url} onClick={() => { this.onResultClick(res) }} />
            )
          })
        }</div>
      </Container>

    );
  }

  public onResultClick = async (res : SearchResult) => {
    this.setState({stopLoadingGallery : false, galleryURLs : new Array()});
    console.log(res);
    setImmediate(async () => {
      let gen = getUserRepos(res);
      while(true)
      {
        if(this.state.stopLoadingGallery == true)
          return;
        let reposRaw = await (gen as any).next();
        console.log(reposRaw);

        let repos = reposRaw.value;
        if(!reposRaw.value || reposRaw.value.length == 0)
          break;

        for(let i = 0; i != repos.length; ++i)
        {
          let URLs = getImageURLs(await getReadMe(repos[i]));
          let galleryURLs = new Array<{ repoURL : string, imgURL : string }>();

          for(let k = 0; k != URLs.length; ++k)
            galleryURLs.push({repoURL : repos[i].html_url,imgURL : URLs[k]});

          this.setState({galleryURLs: this.state.galleryURLs.concat(galleryURLs)});
        }
      }
    });
  }

  public onSearchResults = (res: Array<SearchResult>) => {
    this.setState({galleryURLs : new Array()});
    if(res)
      this.setState({searchResults : res,stopLoadingGallery : true });
  }
}

export default App;