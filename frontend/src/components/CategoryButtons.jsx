import React, { useRef } from 'react';
import './CategoryButtons.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const categories = [
    { name: "Pizza", image: "/Images/pizza.jpg", cuisine: "pizza" },
    { name: "Ice Cream", image: "/Images/icecream.jpg", cuisine: "icecream" },
    { name: "Indian", image: "/Images/indian.jpg", cuisine: "indian" },
    { name: "Italian", image: "/Images/pasta.jpg", cuisine: "italian" },
    { name: "Chinese", image: "/Images/chinese.jpg", cuisine: "chinese" },
    { name: "Sandwich", image: "/Images/sandwich.jpg", cuisine: "sandwich" },
    { name: "Mexican", image: "/Images/mexican.jpg", cuisine: "mexican" },
    { name: "Burgers", image: "/Images/burger.jpg", cuisine: "burger" },
    { name: "Coffee", image: "/Images/coffee.jpg", cuisine: "coffee" },
    { name: "Bakery", image: "/Images/bakery.jpg", cuisine: "bakery" }
];

const CategoryButtons = ({ navigateToCategory }) => {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    return (
        <div className="category-container">
            <button className="scroll-arrow left" onClick={scrollLeft}>
                <FaChevronLeft />
            </button>

            <div className="category-buttons" ref={scrollRef}>
                {categories.map((cat, index) => (
                    <button key={index} onClick={() => navigateToCategory(cat.cuisine)}>
                        <img src={cat.image} alt={cat.name} />
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>

            <button className="scroll-arrow right" onClick={scrollRight}>
                <FaChevronRight />
            </button>
        </div>
    );
};

export default CategoryButtons;
