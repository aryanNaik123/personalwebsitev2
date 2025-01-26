import React from "react";
import Quote from "./Quote";
import { Link } from "react-router-dom";
import { Spotify } from "react-spotify-embed";
import Bookmarks from "./Bookmarks";
export default function Library() {
  return (
    <div>
      <Link to="/" className="ml-5 mt-3 float-left">
        ⏮️
      </Link>
      <br></br>
      <br></br>
      <h2 className="text-xl text-center">Books</h2>
      <ul className="text-left pl-5 text-md">
        <li>The Power Law: Venture Capital and the Making of the New Future</li>
        <li>The Almanack of Naval Ravikant: A Guide to Wealth and Happiness</li>
        <li>The Silo Series by Hugh Howey</li>
        <li>Getting Things Done by David Allen</li>
        <li>The Myth of Sisyphus by Albert Camus</li>
        <li>Project Hail Mary Novel by Andy Weir</li>
      </ul>
      <br></br>
      <hr className="bg-gray-500 w-6/12 m-auto"></hr>
      <br></br>
      <h2 className="text-xl text-center">Songs</h2>
      <div className="grid grid-cols-3 gap-y-2 pl-5 pt-5 gap-x-0">
        <Spotify
          width={300}
          wide
          link="https://open.spotify.com/track/5ujh1I7NZH5agbwf7Hp8Hc?si=d4af94f100e642ba"
        />
        <Spotify
          width={300}
          wide
          link="https://open.spotify.com/track/4KjnaUNYPwGnJjoeTFlt91?si=8b050d60609940a0"
        />
        <Spotify
          width={300}
          wide
          link="https://open.spotify.com/track/0PV1TFUMTBrDETzW6KQulB?si=b79339de93464260"
        />
        <Spotify
          width={300}
          wide
          link="https://open.spotify.com/track/2obblQ6tcePeOEVJV6nEGD?si=6ea44974f3014dab"
        />
        <Spotify
          width={300}
          wide
          link="https://open.spotify.com/track/2RPbEp0DyBVlkRvvYKopO7?si=32705c1bd0384dde"
        />
      </div>
      <br></br>
      <hr className="bg-gray-500 w-6/12 m-auto"></hr>
      <br></br>

      <h2 className="text-xl text-center">Quotes</h2>
      <br></br>
      <div className="text-left text-sm pl-5">
        <Quote
          text="“In my whole life, I have known no wise people (over a broad subject
            matter area) who didn't read all the time—none. Zero. You'd be
            amazed at how much Warren reads—and how much I read. My children
            laugh at me. They think I'm a book with a couple of legs sticking
            out.”"
          author="Charlie Munger"
        />
        <Quote
          text="“Don't walk into a place like you wanna buy it, walk in like you own
        it.”"
          author="Matthew McConaughey"
        />
        <Quote
          text="“If you are depressed you are living in the past.
        If you are anxious you are living in the future.
        If you are at peace you are living in the present.”
        "
          author="Lao Tzu"
        />
        <Quote
          text="“If I only had an hour to chop down a tree, I would spend the first 45 minutes sharpening my axe.”"
          author="Abraham Lincoln"
        />
        <Quote text="“Only the paranoid survive.“" author="Andy Grove" />
        <Quote
          text="“When you grow up you tend to get told that the world is the way it is and your life is just to live your life inside the world-try not to bash into the walls too much, try to have a nice family life, have fun, save a little money. But life-that's a very limited life. Life can be much broader once you discover one simple fact. And that is everything around you that you call life was made up by people that were no smarter than you. And you can change it-you can influence it, you can build your own things that other people can use.“"
          author="Steve Jobs"
        />
        <Quote
          text="“Most people never pick up the phone. Most people never call and ask. And that's what separates sometimes the people who do things from those who just dream about them. You gotta act. You gotta be willing to fail. You gotta be willing to crash a burn. With people on the phone or starting a company, if you're afraid you'll fail, you won't get very far.”"
          author="Steve Jobs"
        />
        <Quote
          text="“Get action. Do things; be sane; don't fritter away your time; create, act, take a place wherever you are and be somebody; get action.”"
          author="Theodore Roosevelt"
        />
        <Quote
          text="“I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear. I will permit it to pass over me and through me. And when it has gone past I will turn the inner eye to see its path. Where the fear has gone there will be nothing. Only I will remain.”"
          author="Frank Herbert, Dune"
        />
      </div>
      <br></br>
      <hr className="bg-gray-500 w-6/12 m-auto"></hr>
      <br></br>
      <h2 className="text-xl text-center">Blog Roll</h2>
      <ul>
        <li>https://sarv.substack.com/</li>
        <li>https://guzey.com/</li>
        <li>https://www.henrikkarlsson.xyz/</li>
        <li>https://sive.rs/</li>
        <li>https://web.archive.org/web/20230930071755mp_/https://www.spakhm.com/archive</li>
        <li>https://grahamduncan.blog/</li>
        <li>https://nadia.xyz/posts/</li> 
        <li>https://near.blog/</li>
        <li>https://www.neelnanda.io/</li>
        <li>https://scottaaronson.blog/</li>
        <li>https://nabeelqu.co/</li>
        <li>https://kaiwenwang.com</li>
      </ul>
      <br></br>
      <hr className="bg-gray-500 w-6/12 m-auto"></hr>
      <br></br>
      <Bookmarks />
    </div>
  );
}
