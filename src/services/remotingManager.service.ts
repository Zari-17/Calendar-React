
class VisualForceRemotingManager {
    private _remoteManager = (window as any)?.Visualforce?.remoting?.Manager || null;
;
    _exceptionHandler(event: any): String {
      return '';
    }
    invoke(controller: string, method: string, args?: String): Promise<any | Error> {
      let action: string = `${controller}.${method}`;
      return new Promise((resolve, reject) => {
        let cb = (result: any, event: { status: any; }): any => {
          event.status 
            ? resolve(result) 
            : reject(this._exceptionHandler(event));
        }
        let remotingParams: object = { escape: false };
        this._remoteManager.invokeAction(
          action,
          args, 
          cb, 
          remotingParams
        );
      });
    }
  }
const visualforce = new VisualForceRemotingManager();
Object.freeze(visualforce);
export default visualforce;