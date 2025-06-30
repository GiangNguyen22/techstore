import Action from "./Action";

interface Item {
  id: string;
  name: string;
}

interface ItemsType {
  data?: any;
}
const Items = ({ data }: ItemsType) => {
  // console.log(data);
  return (
    <div className="flex mt-4 items-center">
      <div className="w-3/12 text-sm">{data?.id}</div>
      <div className="w-3/12 text-sm">{data?.name}</div>
      <div className="w-3/12 text-sm">
        <img src={`http://localhost:8080/${data.image}`} alt="" />
      </div>
      <div className="w-3/12 text-sm">
        <Action id={data?.id} />
      </div>
    </div>
  );
};

export default Items;
