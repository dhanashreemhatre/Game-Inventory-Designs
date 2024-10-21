import { FaTrashAlt } from 'react-icons/fa';

const Inventory3 = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="lg:w-10/12 xl:h-5/6 2xl:w-3/4 w-3/5 h-4/5 flex items-center justify-around bg-violet-300 px-2">
        {/* Left section */}
        <div className="lg:w-auto lg:px-2 2xl:w-52 w-28 h-5/6 bg-slate-600 flex content-center justify-center">
          <div className="grid grid-cols-1 gap-1 place-items-center lg:py-4">
            {["1", "2", "3", "4"].map((item) => (
              <div
                key={item}
                className="w-24 h-24 lg:w-20 lg:h-20 2xl:w-44 2xl:h-44 bg-slate-400 shadow-lg hover:bg-slate-800 rounded-lg flex justify-center items-center text-5xl"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Middle section */}
        <div className="bg-slate-600 lg:w-auto lg:px-2 lg:py-3 xl:w-auto w-2/5 h-5/6 xl:px-2 xl:py-5 xl:flex xl:justify-center">
          <div className="grid grid-cols-4 lg:gap-2 gap-1 xl:gap-2 place-items-center content-center">
            {Array(16)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="w-24 h-24 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-44 2xl:h-44 bg-slate-400 shadow-lg hover:bg-slate-800 rounded-lg"
                >
                  col{index % 2 === 0 ? "1" : "2"}
                </div>
              ))}
          </div>
        </div>

        {/* Right section */}
        <div className="lg:w-72 xl:w-auto xl:px-3 xl:flex xl:place-items-center w-2/5 h-5/6 bg-slate-600">
          <div className="grid grid-cols-3 place-items-center gap-1 xl:gap-2 xl:py-5 py-4">
            {[
              "hatvector.png",
              "watchvector.png",
              "tshirtvector.png",
              "jewelryvector.png",
              "pantvector.png",
              "gunvector.png",
              "shoesvector.png",
              "bagvector.png",
            ].map((img, index) => (
              <div
                key={index}
                className={`playerShow w-24 h-24 xl:w-24 xl:h-24 lg:w-20 lg:h-20 2xl:w-44 2xl:h-44 bg-slate-400 shadow-lg hover:bg-slate-800 rounded-lg ${
                  (index === 0 || index === 4) && "col-start-2"
                }`}
              >
                <img src={`./images/${img}`} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <div id="diyalogc" className="relative z-10 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaTrashAlt className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                      Remove Item
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the selected item? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  id="delete"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Remove
                </button>
                <button
                  type="button"
                  id="cancel"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory3;
