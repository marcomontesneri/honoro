export default class CacheService {
  public offer: any = {};
  setOffer(offer: any) {
    localStorage.setItem("offer", JSON.stringify(offer));
    console.log(offer);
  }
  getOffer() {
    return JSON.parse(localStorage.getItem("offer"));
  }
}
