import React from "react";
import Quote from "./Quote";
import { Link } from "react-router-dom";
export default function Library() {
  return (
    <div>
      <Link to="/" className="ml-5 mt-3 float-left">
        ⏮️
      </Link>
      <br></br>
      <br></br>
      <h2 className="text-xl text-center">Books</h2>
      <ul>
        <li>The Power Law: Venture Capital and the Making of the New Future</li>
        <li>The Almanack of Naval Ravikant: A Guide to Wealth and Happiness</li>
        <li>The Silo Series by Hugh Howey</li>
      </ul>
      <br></br>
      <hr className="bg-gray-500 w-6/12 m-auto"></hr>
      <h2 className="text-xl text-center">quotes that inspire me</h2>
      <br></br>
      <Quote
        text="“In my whole life, I have known no wise people (over a broad subject
            matter area) who didn’t read all the time—none. Zero. You’d be
            amazed at how much Warren reads—and how much I read. My children
            laugh at me. They think I’m a book with a couple of legs sticking
            out.”"
        author="Charlie Munger"
      />
      <Quote
        text="“Don’t walk into a place like you wanna buy it, walk in like you own
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
        text="“Most people never pick up the phone. Most people never call and ask. And that’s what separates sometimes the people who do things from those who just dream about them. You gotta act. You gotta be willing to fail. You gotta be willing to crash a burn. With people on the phone or starting a company, if you’re afraid you’ll fail, you won’t get very far.”"
        author="Steve Jobs"
      />
    </div>
  );
}
