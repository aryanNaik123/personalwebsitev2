import React from "react";
import Quote from "./Quote";
import { Link } from "react-router-dom";
export default function Library() {
  return (
    <div>
      <Link to="/" className="ml-5 mt-3 float-left">
        ⏮️
      </Link>
      <h2 className="text-xl text-center">Books</h2>
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
    </div>
  );
}
