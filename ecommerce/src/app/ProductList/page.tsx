import Image from 'next/image';

const ProductList = () => {
    return (
        <div className="max-w-full h-screen flex flex-col md:flex-row p-4 bg-red-500">
            <div className="w-full md:w-1/4 bg-green-400 p-4 overflow-auto">lore</div>
            <div className="w-full md:w-3/4 bg-yellow-400 p-4 overflow-auto">
                <span>Home || Mobiles </span>
                <hr />
                <Image src="https://images.unsplash.com/photo-1567581935884-3349723552ca?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW9iaWxlfGVufDB8fDB8fHww" alt="" layout="fill" objectFit="cover" />
                <img src="https://images.unsplash.com/photo-1567581935884-3349723552ca?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW9iaWxlfGVufDB8fDB8fHww" alt="" >
                </img>

            </div>
            <div className="w-[60%] bg-orange-500">2</div>
            <div className="w-[20%] bg-green-500">3</div>
        </div>



    );
}

export default ProductList;



