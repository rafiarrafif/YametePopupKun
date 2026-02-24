import { KuronimeController } from "../modules/kuronime/kuronime.controller";

export const router = async (target: string) => {
  switch (target) {
    case "Kuronime":
      return new KuronimeController().mainHandler();
  }
};
