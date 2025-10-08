import React from "react";
import Portal from "../components/Portal";

type TacModalProps = {
  onClose: () => void;
};

function TacModal({ onClose }: TacModalProps) {
  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-xs">
        <div className="relative flex w-11/12 max-w-2xl flex-col gap-4 rounded-lg border-2 bg-white p-6 shadow-lg">
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-black"
          >
            X
          </button>
          <h2 className="text-xl font-bold">Terms and Conditions</h2>
          <p className="text-sm">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis
            fuga sed voluptate laboriosam similique itaque, fugit delectus, modi
            cum dolores ipsa, animi iusto dolore at eligendi corrupti aspernatur
            odit sapiente.
          </p>
        </div>
      </div>
    </Portal>
  );
}

export default TacModal;
