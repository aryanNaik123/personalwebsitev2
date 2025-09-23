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
        <li>Engines That Move Markets by Alasdair Nairn</li>
      </ul>
      <br></br>
      <hr className="bg-gray-500 w-6/12 m-auto"></hr>
      <br></br>
      <h2 className="text-xl text-center">Songs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5 pt-5">
        <div className="w-full">
          <Spotify
            width="100%"
            wide
            link="https://open.spotify.com/track/5ujh1I7NZH5agbwf7Hp8Hc?si=d4af94f100e642ba"
          />
        </div>
        <div className="w-full">
          <Spotify
            width="100%"
            wide
            link="https://open.spotify.com/track/4KjnaUNYPwGnJjoeTFlt91?si=8b050d60609940a0"
          />
        </div>
        <div className="w-full">
          <Spotify
            width="100%"
            wide
            link="https://open.spotify.com/track/0PV1TFUMTBrDETzW6KQulB?si=b79339de93464260"
          />
        </div>
        <div className="w-full">
          <Spotify
            width="100%"
            wide
            link="https://open.spotify.com/track/2obblQ6tcePeOEVJV6nEGD?si=6ea44974f3014dab"
          />
        </div>
        <div className="w-full">
          <Spotify
            width="100%"
            wide
            link="https://open.spotify.com/track/2RPbEp0DyBVlkRvvYKopO7?si=32705c1bd0384dde"
          />
        </div>
      </div>
      <br></br>
      <hr className="bg-gray-500 w-6/12 m-auto"></hr>
      <br></br>

      <h2 className="text-xl text-center">Quotes</h2>
      <br></br>
      <div className="text-left text-sm pl-5 pr-5">
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
        <Quote 
          text="“If you do everything, you'll win.”"
          author="Lyndon B. Johnson"
        />
        <Quote
          text="“The function of the overwhelming majority of your artwork is simply to teach you how to make the small fraction of your artwork that soars. One of the basic and difficult lessons every artist must learn is that even the failed pieces are essential. X-rays of famous paintings reveal that even master artists sometimes made basic mid-course corrections (or deleted really dumb mistakes) by overpainting the still-wet canvas. The point is that you learn how to make your work by making your work, and a great many of the pieces you make along the way will never stand out as finished art. The best you can do is make art you care about — and lots of it!”"
          author="David Bayles, Art & Fear: Observations on the Perils (and Rewards) of Artmaking"
        />
      </div>
      <br></br>
      <hr className="bg-gray-500 w-6/12 m-auto"></hr>
      <br></br>
      <h2 className="text-xl text-center">Blog Roll</h2>
      <br></br>
      <ul className="space-y-1">
        <li><a href="https://sarv.substack.com/" className="transition-all duration-200 ease-in-out hover:bg-gray-200 hover:px-3 py-0.5 rounded" target="_blank" rel="noopener noreferrer">Sarv's Newsletter</a></li>
        <li><a href="https://guzey.com/" className="transition-all duration-200 ease-in-out hover:bg-gray-200 hover:px-3 py-0.5 rounded" target="_blank" rel="noopener noreferrer">Alexey Guzey</a></li>
        <li><a href="https://www.henrikkarlsson.xyz/" className="transition-all duration-200 ease-in-out hover:bg-gray-200 hover:px-3 py-0.5 rounded" target="_blank" rel="noopener noreferrer">Henrik Karlsson</a></li>
        <li><a href="https://sive.rs/" className="transition-all duration-200 ease-in-out hover:bg-gray-200 hover:px-3 py-0.5 rounded" target="_blank" rel="noopener noreferrer">Derek Sivers</a></li>
        <li><a href="https://web.archive.org/web/20230930071755mp_/https://www.spakhm.com/archive" className="transition-all duration-200 ease-in-out hover:bg-gray-200 hover:px-3 py-0.5 rounded" target="_blank" rel="noopener noreferrer">Slava Pakhomov</a></li>
        <li><a href="https://grahamduncan.blog/" className="transition-all duration-200 ease-in-out hover:bg-gray-200 hover:px-3 py-0.5 rounded" target="_blank" rel="noopener noreferrer">Graham Duncan</a></li>
        <li><a href="https://nadia.xyz/posts/" className="transition-all duration-200 ease-in-out hover:bg-gray-200 hover:px-3 py-0.5 rounded" target="_blank" rel="noopener noreferrer">Nadia Asparouhova</a></li>
        <li><a href="https://near.blog/" className="transition-all duration-200 ease-in-out hover:bg-gray-200 hover:px-3 py-0.5 rounded" target="_blank" rel="noopener noreferrer">Near Blog</a></li>
        <li><a href="https://www.neelnanda.io/" className="transition-all duration-200 ease-in-out hover:bg-gray-200 hover:px-3 py-0.5 rounded" target="_blank" rel="noopener noreferrer">Neel Nanda</a></li>
        <li><a href="https://scottaaronson.blog/" className="transition-all duration-200 ease-in-out hover:bg-gray-200 hover:px-3 py-0.5 rounded" target="_blank" rel="noopener noreferrer">Scott Aaronson</a></li>
        <li><a href="https://nabeelqu.co/" className="transition-all duration-200 ease-in-out hover:bg-gray-200 hover:px-3 py-0.5 rounded" target="_blank" rel="noopener noreferrer">Nabeel Qureshi</a></li>
        <li><a href="https://kaiwenwang.com" className="transition-all duration-200 ease-in-out hover:bg-gray-200 hover:px-3 py-0.5 rounded" target="_blank" rel="noopener noreferrer">Kaiwen Wang</a></li>
      </ul>
      <br></br>
      <hr className="bg-gray-500 w-6/12 m-auto"></hr>
      <br></br>
      <Bookmarks />
    </div>
  );
}
