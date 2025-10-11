import React from "react";
import Portal from "../components/Portal";

type TacModalProps = {
  onClose: () => void;
};

function TacModal({ onClose }: TacModalProps) {
  return (
    <Portal>
      <section className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-xs">
        <div className="max-w-[800px] bg-white m-4 p-6">
          <div className="border-2 border-[#646464]">
            <div className="flex justify-between items-center border-b-2 border-[#646464]">
              <h2 className="text-2xl font-bold my-4 mx-6 font-['PT_Sans']">
                Terms and Conditions
              </h2>
              <button onClick={onClose}>
                <svg
                  className="w-5 h-5 mr-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.53341 19.3334L0.666748 17.4667L8.13341 10.0001L0.666748 2.53341L2.53341 0.666748L10.0001 8.13341L17.4667 0.666748L19.3334 2.53341L11.8667 10.0001L19.3334 17.4667L17.4667 19.3334L10.0001 11.8667L2.53341 19.3334Z"
                    fill="#929292"
                  />
                </svg>
              </button>
            </div>

            <p className="text-sm p-6">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Blanditiis fuga sed voluptate laboriosam similique itaque, fugit
              delectus, modi cum dolores ipsa, animi iusto dolore at eligendi
              corrupti aspernatur odit sapiente.
            </p>
          </div>
        </div>
      </section>
    </Portal>
  );
}

export default TacModal;
