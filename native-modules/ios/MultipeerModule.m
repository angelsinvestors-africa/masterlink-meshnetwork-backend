#import "React/RCTBridgeModule.h"
#import <MultipeerConnectivity/MultipeerConnectivity.h>

@interface MultipeerModule : NSObject <RCTBridgeModule, MCNearbyServiceAdvertiserDelegate, MCNearbyServiceBrowserDelegate, MCSessionDelegate>
@property (nonatomic, strong) MCSession *session;
@property (nonatomic, strong) MCPeerID *peerID;
@property (nonatomic, strong) MCNearbyServiceAdvertiser *advertiser;
@property (nonatomic, strong) MCNearbyServiceBrowser *browser;
@end

@implementation MultipeerModule

RCT_EXPORT_MODULE();

- (instancetype)init {
  if (self = [super init]) {
    self.peerID = [[MCPeerID alloc] initWithDisplayName:[[UIDevice currentDevice] name]];
    self.session = [[MCSession alloc] initWithPeer:self.peerID securityIdentity:nil encryptionPreference:MCEncryptionRequired];
    self.session.delegate = self;
    
    self.advertiser = [[MCNearbyServiceAdvertiser alloc] initWithPeer:self.peerID discoveryInfo:nil serviceType:@"mesh-net"];
    self.advertiser.delegate = self;
    [self.advertiser startAdvertisingPeer];
    
    self.browser = [[MCNearbyServiceBrowser alloc] initWithPeer:self.peerID serviceType:@"mesh-net"];
    self.browser.delegate = self;
    [self.browser startBrowsingForPeers];
  }
  return self;
}

RCT_EXPORT_METHOD(getConnectedPeers:(RCTResponseSenderBlock)callback)
{
  NSMutableArray *peersArray = [NSMutableArray array];
  for (MCPeerID *peer in self.session.connectedPeers) {
    NSDictionary *peerInfo = @{
      @"id": peer.displayName,
      @"name": peer.displayName,
      @"signalStrength": @"strong",
      @"priority": @3
    };
    [peersArray addObject:peerInfo];
  }
  NSError *error;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:peersArray options:0 error:&error];
  if (!jsonData) {
    callback(@[error.localizedDescription, [NSNull null]]);
  } else {
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    callback(@[[NSNull null], jsonString]);
  }
}

#pragma mark - MCSessionDelegate
- (void)session:(MCSession *)session peer:(MCPeerID *)peerID didChangeState:(MCSessionState)state {}

- (void)session:(MCSession *)session didReceiveData:(NSData *)data fromPeer:(MCPeerID *)peerID {}
- (void)session:(MCSession *)session didStartReceivingResourceWithName:(NSString *)resourceName fromPeer:(MCPeerID *)peerID withProgress:(NSProgress *)progress {}
- (void)session:(MCSession *)session didFinishReceivingResourceWithName:(NSString *)resourceName fromPeer:(MCPeerID *)peerID atURL:(NSURL *)localURL withError:(NSError *)error {}
- (void)session:(MCSession *)session didReceiveStream:(NSInputStream *)stream withName:(NSString *)streamName fromPeer:(MCPeerID *)peerID {}

#pragma mark - MCNearbyServiceAdvertiserDelegate
- (void)advertiser:(MCNearbyServiceAdvertiser *)advertiser didNotStartAdvertisingPeer:(NSError *)error {}
- (void)advertiser:(MCNearbyServiceAdvertiser *)advertiser didReceiveInvitationFromPeer:(MCPeerID *)peerID withContext:(NSData *)context invitationHandler:(void (^)(BOOL, MCSession * _Nullable))invitationHandler {
  invitationHandler(YES, self.session);
}

#pragma mark - MCNearbyServiceBrowserDelegate
- (void)browser:(MCNearbyServiceBrowser *)browser didNotStartBrowsingForPeers:(NSError *)error {}
- (void)browser:(MCNearbyServiceBrowser *)browser foundPeer:(MCPeerID *)peerID withDiscoveryInfo:(NSDictionary<NSString *,NSString *> *)info {
  [browser invitePeer:peerID toSession:self.session withContext:nil timeout:30];
}
- (void)browser:(MCNearbyServiceBrowser *)browser lostPeer:(MCPeerID *)peerID {}

@end
