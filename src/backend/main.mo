import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Core Types
  type Memory = {
    id : Text;
    title : Text;
    description : Text;
    date : Text;
    tags : [Text];
    authorId : Principal;
    authorName : Text;
    blobIds : [Storage.ExternalBlob];
    createdAt : Int;
  };

  module Memory {
    public func compare(mem1 : Memory, mem2 : Memory) : Order.Order {
      Text.compare(mem1.id, mem2.id);
    };

    public func compareByCreatedAtDesc(mem1 : Memory, mem2 : Memory) : Order.Order {
      Int.compare(mem2.createdAt, mem1.createdAt);
    };

    public func compareById(mem1 : Memory, mem2 : Memory) : Order.Order {
      Text.compare(mem1.id, mem2.id);
    };
  };

  module Principal {
    public func compare(p1 : Principal, p2 : Principal) : Order.Order {
      Text.compare(p1.toText(), p2.toText());
    };
  };

  // Maps and State
  let memories = Map.empty<Nat, Memory>();
  var nextMemoryId = 1;

  // Memory Manipulation Functions
  public shared ({ caller }) func addMemory(title : Text, description : Text, date : Text, tags : [Text], authorName : Text, blobIds : [Storage.ExternalBlob]) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add memories");
    };
    let memoryId = nextMemoryId.toText();
    let memory : Memory = {
      id = memoryId;
      title;
      description;
      date;
      tags;
      authorId = caller;
      authorName;
      blobIds;
      createdAt = Time.now();
    };
    memories.add(nextMemoryId, memory);
    nextMemoryId += 1;
    memoryId;
  };

  public shared ({ caller }) func updateMemory(memoryId : Text, title : Text, description : Text, date : Text, tags : [Text], authorName : Text) : async () {
    switch (Nat.fromText(memoryId)) {
      case (null) { Runtime.trap("Memory not found") };
      case (?natId) {
        let existing = switch (memories.get(natId)) {
          case (null) { Runtime.trap("Memory not found") };
          case (?mem) { mem };
        };
        if (existing.authorId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the author or admin can edit this memory");
        };
        let updated : Memory = {
          id = existing.id;
          title;
          description;
          date;
          tags;
          authorId = existing.authorId;
          authorName;
          blobIds = existing.blobIds;
          createdAt = existing.createdAt;
        };
        memories.add(natId, updated);
      };
    };
  };

  public query ({ caller }) func getMemoryById(memoryId : Text) : async Memory {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view memories");
    };
    switch (Nat.fromText(memoryId)) {
      case (null) { Runtime.trap("Memory not found") };
      case (?natId) {
        switch (memories.get(natId)) {
          case (null) { Runtime.trap("Memory not found") };
          case (?memory) { memory };
        };
      };
    };
  };

  public query ({ caller }) func listAllMemories() : async [Memory] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view memories");
    };
    memories.values().toArray().sort(Memory.compareByCreatedAtDesc);
  };

  public shared ({ caller }) func deleteMemory(memoryId : Text) : async () {
    switch (Nat.fromText(memoryId)) {
      case (null) { Runtime.trap("Memory not found") };
      case (?natId) {
        let memory = switch (memories.get(natId)) {
          case (null) { Runtime.trap("Memory not found") };
          case (?mem) { mem };
        };
        if (memory.authorId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the author or admin can delete this memory");
        };
        memories.remove(natId);
      };
    };
  };

  // Tag Management
  public query ({ caller }) func getAllUniqueTags() : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view tags");
    };

    let tagList = List.empty<Text>();

    for (memory in memories.values()) {
      for (tag in memory.tags.values()) {
        tagList.add(tag);
      };
    };

    let sortedTags = tagList.toArray().sort();
    let uniqueTags = List.empty<Text>();
    var lastTag : ?Text = null;

    for (tag in sortedTags.values()) {
      switch (lastTag) {
        case (null) {
          uniqueTags.add(tag);
          lastTag := ?tag;
        };
        case (?last) {
          if (tag != last) {
            uniqueTags.add(tag);
            lastTag := ?tag;
          };
        };
      };
    };

    uniqueTags.toArray();
  };

  // Seed Data Function
  public shared ({ caller }) func addSampleMemories() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add sample memories");
    };

    let samples = [
      {
        title = "Family Reunion 2023";
        description = "Amazing weekend with the whole family at the lake house!";
        date = "2023-07-21";
        tags = ["Family", "Reunion"];
        authorName = "Grandma";
        blobIds = [];
      },
      {
        title = "Ski Trip Adventure";
        description = "Our first time skiing together in the mountains. Lots of falls!";
        date = "2022-12-15";
        tags = ["Trips", "Winter"];
        authorName = "Dad";
        blobIds = [];
      },
    ];

    for (memory in samples.values()) {
      let memoryId = nextMemoryId.toText();
      let newMemory : Memory = {
        id = memoryId;
        title = memory.title;
        description = memory.description;
        date = memory.date;
        tags = memory.tags;
        authorId = caller;
        authorName = memory.authorName;
        blobIds = memory.blobIds;
        createdAt = Time.now();
      };
      memories.add(nextMemoryId, newMemory);
      nextMemoryId += 1;
    };
  };
};
