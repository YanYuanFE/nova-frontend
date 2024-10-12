
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img
        src="https://dashboard.shadcnuikit.com/images/404.svg" // 请确保在public文件夹中有这个图片
        alt="404 Not Found"
        width={300}
        height={300}
      />
      <h1 className="text-4xl font-bold mt-8">404</h1>
      <p className="text-xl mt-4">Page Not Found</p>
    </div>
  );
};

export default NotFound;
